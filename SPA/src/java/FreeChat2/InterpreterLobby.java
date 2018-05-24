/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.Interpreter;
import MyWeb.ImageProcessing;
import MyWeb.GuarbageWatch;
import MyWeb.Ip;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import MySocket.AsynchronousSenders;
import MyWeb.Database.Database;
import MyWeb.IGetIp;
import MyWeb.Sessions.Session;
import Profiles.IInterpreterAuthentication;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
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
    private String ip;
    private User user;
    private StopWatch stopWatchProfilePicture = new StopWatch();

    public InterpreterLobby(AsynchronousSender asynchronousSender, IGetIp iGetIp) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
        this.ip = iGetIp.getIp();
        stopWatchProfilePicture.set_ms(30000);
    }

    @Override
    public void interpret(JSONObject jObject, Session session) throws Exception {
        try {
            String type = jObject.getString("type");
            System.out.println("InterpreterLobby.interpret type: " + type);
            if (type.equals("users")) {
                users(false);
            } else {
                if (type.equals("connect")) {
                    connect(jObject, session);
                } else {
                    if (type.equals("get_rooms")) {
                        getRooms();
                    } else {
                        if (type.equals("pm")) {
                            pm(jObject, session);
                            System.out.println("pm object: " + jObject.toString());
                        } else {
                            if (type.equals("video_pm")) {
                                videoPm(jObject);
                            } else {
                                if (type.equals("create_room")) {
                                    createRoom(jObject, session);
                                } else {
                                    if (type.equals("profile_picture")) {
                                        profilePicture(jObject, session);
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

    private void connect(JSONObject jObject, Session session) throws Exception {
        try {
            User user = authenticate(session);
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "connect");
            jObjectReply.put("user_id", user.id);
            asynchronousSender.send(jObjectReply);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void getRooms() throws Exception {
        asynchronousSender.send(Rooms.getPopularJSONObject(Database.getInstance(), AsynchronousSenders.getInstance()));
    }

    private void users(boolean toAll) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "users");
            jObjectReply.put("users", Users.getAllJSONArray(Database.getInstance()));
            if (toAll) {
                Users.sendMessageToAllOnline(jObjectReply, Database.getInstance(), AsynchronousSenders.getInstance());
            } else {
                asynchronousSender.send(jObjectReply);
            }
        } catch (JSONException ex) {
            throw ex;
        }
    }

    private void pm(JSONObject jObject, Session session) throws Exception {
        try {
            authenticate(session);
            UUID otherUserId = new UUID(jObject.getString("otherUserId"));
            if (otherUserId != null) {
                Room room = PmsHelper.getOrCreate(otherUserId, user.id, Database.getInstance(), AsynchronousSenders.getInstance());
                if (room != null) {
                    JSONObject jObjectReply = new JSONObject();
                    jObjectReply.put("id", room.id);
                    jObjectReply.put("type", "pm");
                    asynchronousSender.send(jObjectReply);
                }
            }
            //Pms.open(otherUniqueId, user);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void videoPm(JSONObject jObject) throws Exception {
        try {
            String otherUniqueId = jObject.getString("otherUserId");
            //VideoPms.open(otherUniqueId, user);

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void profilePicture(JSONObject jObject, Session session) throws Exception {
        User user = authenticate(session);
        if (user != null) {
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
                jObjectReply.put("name", user.getName(Database.getInstance()));
                user.setPictureRelativePath(relativePath, Database.getInstance());
                Users.sendMessageToAllOnline(jObjectReply, Database.getInstance(), AsynchronousSenders.getInstance());
            } else {
                jObjectReplySender.put("reason", reason);
            }
            asynchronousSender.send(jObjectReplySender);
            //if(jObject.getString("webcam_type").equals("request"))
            //{
            //    VideoPms.openForOtherUser(u, r , jObject);
            //}
        }
    }

    private User authenticate(Session session) throws Exception {
        user = Users.validate(session.id, Database.getInstance());
        if (user != null) {

        }
        return user;
    }

    private void createRoom(JSONObject jObject, Session session) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "create_room");
            String reason = null;
            User user = authenticate(session);
            boolean successful = false;
            if (user != null) {
                String name = jObject.getString("name");
                boolean hasPassword = jObject.getBoolean("has_password");
                try {
                    Rooms.createNew(name, RoomType.Text, hasPassword, hasPassword ? jObject.getString("password") : null, Database.getInstance(), AsynchronousSenders.getInstance());
                    successful = true;
                    Users.sendMessageToAllOnline(Rooms.getPopularJSONObject(Database.getInstance(), AsynchronousSenders.getInstance()), Database.getInstance(), AsynchronousSenders.getInstance());
                } catch (RoomCreationException ex) {
                    reason = ex.toString();
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
            try {
                Database.getInstance().getLobbyToUsers().remove(user.id);
                users(true);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void preSendAuthenticationReply(String username, Boolean successful, Profiles.User user) throws Exception {
        if (successful) {
            AsynchronousSenders.getInstance().add(asynchronousSender, user.getUuid());
            System.out.println("name is: ");
            System.out.println(asynchronousSender.getName());
            Database.getInstance().getLobbyToUsers().add(user.getUuid(), asynchronousSender.getName());
        }
    }

    @Override
    public void postSendAuthenticationReply(Boolean successful, JSONObject jObjectReply) throws Exception {
        if (successful) {
            users(true);
        }
    }
}
