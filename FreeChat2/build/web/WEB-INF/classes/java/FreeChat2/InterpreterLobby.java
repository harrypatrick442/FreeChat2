/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.Interpreter;
import MyWeb.ImageProcessing;
import MyWeb.GuarbageWatch;
import MyWeb.Ip;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import static FreeChat2.Rooms.getUniqueId;
import MySocket.IGetInterpreter;
import MySocket.ISend;
import MySocket.MySocket;
import MyWeb.IGetIp;
import Profiles.IInterpreterAuthentication;
import Profiles.InterpreterProfiles;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.lang.ref.WeakReference;
import java.util.Base64;
import javax.imageio.ImageIO;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterLobby extends Interpreter implements Serializable, IInterpreterAuthentication {

    public AsynchronousSender asynchronousSender;
    private User user;
    private String ip;
    private StopWatch stopWatchProfilePicture = new StopWatch();

    public InterpreterLobby(AsynchronousSender asynchronousSender, IGetIp iGetIp) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
        user = new User(asynchronousSender);
        this.ip = iGetIp.getIp();
        Users.add(user);
        stopWatchProfilePicture.set_ms(30000);
    }

    public void interpret(JSONObject jObject) throws Exception {
        try {
            String type = jObject.getString("type");
            if (type.equals("users")) {
                users(false);
            } else {
                if (type.equals("connect")) {
                    connect(jObject);
                } else {
                    if (type.equals("get_rooms")) {
                        getRooms();
                    } else {
                        if (type.equals("pm")) {
                            pm(jObject);
                        } else {
                            if (type.equals("video_pm")) {
                                videoPm(jObject);
                            } else {
                                if (type.equals("create_room")) {
                                    createRoom(jObject);
                                } else {
                                    if (type.equals("profile_picture")) {
                                        profilePicture(jObject);
                                    }
                                }
                            }
                        }

                    }

                }
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void connect(JSONObject jObject) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "connect");
            jObjectReply.put("user_id", user.id);
            user.send(jObjectReply);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void getRooms() throws Exception {
        try {
            asynchronousSender.send(Rooms.getJSONObject());
        } catch (JSONException ex) {
            throw ex;
        }
    }

    private void users(boolean toAll) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "users");
            jObjectReply.put("users", Users.getJSONArray());
            if (toAll) {
                Users.sendMessage(jObjectReply);
            } else {
                user.send(jObjectReply);
            }
        } catch (JSONException ex) {
            throw ex;
        }

    }

    private void pm(JSONObject jObject) throws Exception {
        try {
            String otherUsername = jObject.getString("other_username");
            Pms.open(otherUsername, user);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void videoPm(JSONObject jObject) throws Exception {
        try {
            String otherUsername = jObject.getString("other_username");
            VideoPms.open(otherUsername, user);

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void profilePicture(JSONObject jObject) throws Exception {
        if (user != null) {
            if (user.active && user.name != null) {
                String relativePath = null;
                Base64.Decoder decoder = Base64.getDecoder();
                JSONObject jObjectReplySender = new JSONObject();
                boolean successful = false;
                String reason = "A generic error occured!";
                jObjectReplySender.put("type", "profile_picture_reply");
                if (stopWatchProfilePicture.get_ms() > 4000) {
                    stopWatchProfilePicture.Reset();
                    String encodedData = jObject.getString("data");
                    if (encodedData != null && !encodedData.equals("")) {
                        try {
                            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(decoder.decode(encodedData)));
                            if (bufferedImage != null) {
                                while (true) {
                                    if (jObject.getBoolean("crop")) {
                                        bufferedImage = ImageProcessing.crop(bufferedImage, jObject.getInt("x"), jObject.getInt("y"), jObject.getInt("w"), jObject.getInt("h"));
                                        if (bufferedImage == null) {
                                            break;
                                        } else {
                                            reason = "profile picture cropping failed!";
                                        }
                                    }
                                    //bufferedImage = ImageProcessing.compress((bufferedImage));
                                    relativePath = ImageProcessing.save(bufferedImage);
                                    jObjectReplySender.put("path", relativePath);
                                    ImageProcessing.Logging.log(ip, relativePath);
                                    successful = true;
                                    break;
                                }
                            } else {

                            }
                        } catch (IOException ex) {
                        } catch (IllegalArgumentException ex) {
                        }
                    } else {
                        reason = "encoded data recieved by server was empty!";
                    }
                } else {
                    reason = "You can only upload one profile picture every 30 seconds!";
                }
                jObjectReplySender.put("successful", successful);
                if (successful) {

                    JSONObject jObjectReply = new JSONObject();
                    jObjectReply.put("type", "profile_picture");
                    jObjectReply.put("path", relativePath);
                    jObjectReply.put("name", user.name);
                    user.picture = relativePath;
                    Users.sendMessage(jObjectReply);
                } else {
                    jObjectReplySender.put("reason", reason);
                }
                asynchronousSender.send(jObjectReplySender);
            }

            //if(jObject.getString("webcam_type").equals("request"))
            //{
            //    VideoPms.openForOtherUser(u, r , jObject);
            //}
        }
    }

    private void createRoom(JSONObject jObject) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "create_room");
            String reason = null;
            boolean successful = false;
            if (user != null) {
                User u = user;
                if (u != null && u.name != null) {
                    String name = jObject.getString("name");
                    String result = Rooms.isValidName(name);
                    if (result == null) {
                        String id = getUniqueId();
                        while (true) {
                            if (jObject.getBoolean("has_password")) {
                                String password = jObject.getString("password");
                                if (password.length() > 0) {
                                    Rooms.add(new Room(id, name, true, password, Room.typeFromString(jObject.getString("room_type"))));
                                    break;
                                }
                            }
                            Rooms.add(new Room(id, name, Room.typeFromString(jObject.getString("room_type"))));
                            break;
                        }
                        successful = true;
                    } else {
                        reason = result;
                    }
                } else {
                    reason = "You must be signed in to create a room!";
                }
            } else {
                reason = "You must be signed in to create a room!";
            }
            jObjectReply.put("successful", successful);
            jObjectReply.put("reason", reason);
            asynchronousSender.send(jObjectReply);
        } catch (JSONException ex) {
            throw ex;
        }
    }

    public void close() {
        if (user != null) {

            User u = user;
            if (u != null) {
                u.active = false;
                Users.remove(u);
                try {
                    users(true);
                } catch (Exception ex) {
            ex.printStackTrace();
                }
            }
        }
    }

    @Override
    public void preSendAuthenticationReply(String username, Boolean successful, Profiles.User unused) throws Exception {
        if (successful) {
            FreeChat2.User u = null;
            if (user != null) {
                u = user;
                if (u != null) {
                    u.setName(username);
                    u.active = true;
                    Ip.name(ip, username);
                }
            }/* else {
                    jObjectReply.put("reason", "Websocket error, reload page!");
                }*/
        }
    }

    @Override
    public void postSendAuthenticationReply(Boolean successful, JSONObject jObjectReply) throws Exception {if (successful) {
            users(true);
            FreeChat2.User u = null;
            if (user != null) {
                u = user;
                if (u != null) {
                    u.sendUsersToAllRooms();
                }
            }
            asynchronousSender.send(jObjectReply);
        }
    }
}
