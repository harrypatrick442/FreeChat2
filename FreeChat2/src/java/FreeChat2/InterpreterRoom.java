/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.Interpreter;
import MyWeb.ImageProcessing;
import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import MySocket.IGetInterpreter;
import MySocket.ISend;
import MySocket.MySocket;
import MyWeb.IGetIp;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.lang.ref.WeakReference;
import java.util.Base64;
import java.util.Iterator;
import javax.imageio.ImageIO;
import javax.websocket.Session;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterRoom extends Interpreter implements Serializable {

    private AsynchronousSender asynchronousSender;
    private WeakReference<Room> room;
    private WeakReference<User> user;
    private StopWatch stopWatchLastTyping = new StopWatch();
    private StopWatch stopWatchLastMessage = new StopWatch();
    private String lastMessage = null;
    private StopWatch stopWatchImage = new StopWatch();
    private String ip;

    public InterpreterRoom(AsynchronousSender asynchronousSender, IGetIp iGetIp) {
       GuarbageWatch.add(this) ;
        this.asynchronousSender = asynchronousSender;
        this.ip = iGetIp.getIp();
    }

    public void interpret(JSONObject jObject) throws Exception {
        try {

            String type = jObject.getString("type");
            if (type.equals("connect")) {
                connect(jObject);
            } else {
                if (type.equals("typing")) {
                    typing(jObject);
                } else {
                    if (type.equals("message")) {
                        message(jObject);
                    } else {
                        if (type.equals("sound")) {
                            sound(jObject);
                        } else {
                            if (type.equals("video")) {
                                video(jObject);
                            } else {
                                if (type.equals("upload_image")) {
                                    uploadImage(jObject);
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
            boolean successful = true;
            jObjectReply.put("type", "connect");
            boolean sendUsers = false;
            Room room = null;
            User user = null;
            String reason = null;
            while (true) {
                String userId = jObject.getString("user_id");
                if (userId != null && userId != "") {
                    String roomId = jObject.getString("room_id");
                    if (roomId != null) {
                        room = Rooms.get(roomId);
                        if (room != null) {
                            this.room = new WeakReference<Room>(room);
                            user = Users.userFromId(userId);
                            if (user != null) {
                                this.user = new WeakReference<User>(user);
                                if (room.passwordProtected) {
                                    String password = jObject.getString("password");
                                    if (password != null && password.equals(room.password)) {
                                        room.add(user, asynchronousSender);
                                        user.addRoomIn(roomId, room);
                                        sendUsers = true;
                                        break;

                                    } else {
                                        reason = "Wrong password!";
                                    }
                                } else {
                                    room.add(user, asynchronousSender);
                                    user.addRoomIn(roomId, room);
                                    sendUsers = true;
                                    break;
                                }
                            } else {

                            }
                        } else {
                            reason = "Room no longer exists!";
                        }
                    }
                }
                successful = false;
                break;
            }
            jObjectReply.put("successful", successful);
            if (!successful && reason != null) {
                jObjectReply.put("reason", reason);
            }
            asynchronousSender.send(jObjectReply);
            if (sendUsers) {
                room.sendUsers();
            }
            if (successful) {
                postAddUserOperations(room, user);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    private void postAddUserOperations(Room room, User user) throws Exception {
        switch (room.type) {
            case VideoPM:
                if (room.getNUsers() >= 2) {
                    VideoPms.sendVideoConnect(room);
                }
                break;
            case VideoStatic:
                break;
            case VideoDynamic:
                break;
            case PM:
                break;
            default:
                if (!room.passwordProtected) {
                    sendHistory(room, user);
                }
                sendAdminMessages(room, user);
                break;

        }
                sendFinishedLoading(room, user);
    }

    private void sendHistory(Room room, User user) {
        Iterator<JSONObject> iterator = room.getHistory().iterator();
        AsynchronousSender as = room.getAsynchronousSender(user);
        while (iterator.hasNext()) {
            as.send(iterator.next());
        }
    }
    private void sendFinishedLoading(Room room, User user) {
        AsynchronousSender as = room.getAsynchronousSender(user);
        JSONObject jObject = new JSONObject();
        try
        {
        jObject.put("type", "finished_loading");
        }
        catch(JSONException ex)
        {
            
        }
        as.send(jObject);
    }

    private void sendAdminMessages(Room room, User user)
    {
        room.getAsynchronousSender(user).send(room.getAdminMessages());
    }
    private void message(JSONObject jObject) throws Exception {
        try {
            String jObjectString = jObject.toString();
            if (jObjectString!= lastMessage && stopWatchLastMessage.get_ms() > 1300) {
                if (user != null && !user.isEnqueued()) {
                    User u = user.get();
                    if (u.active && u.name != null) {
                        if (this.room != null && !this.room.isEnqueued()) {
                            Room r = room.get();
                            if (r != null) {
                                lastMessage = jObjectString;
                                r.sendMessage(u, jObject, true);
                                r.addMessageToHistory(jObject);
                                if (r.type.equals(Room.Type.PM) && r.getNUsers() == 1) {
                                    Pms.reopen(u, r, jObject);
                                }
                            }
                        }
                    }
                }
            }
            stopWatchLastMessage.Reset();

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void sound(JSONObject jObject) throws Exception {
        try {
            if (user != null && !user.isEnqueued()) {
                User u = user.get();
                if (u.active && u.name != null) {
                    if (this.room != null && !this.room.isEnqueued()) {
                        Room r = room.get();
                        if (r != null) {
                            jObject.put("from", u.name);
                            r.sendMessage(u, jObject, true);
                        }
                    }
                }
            }

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void typing(JSONObject jObject) throws Exception {
        try {
            if (user != null && !user.isEnqueued()) {
                User u = user.get();
                if (u.active && u.name != null) {
                    if (this.room != null && !this.room.isEnqueued()) {
                        Room r = room.get();
                        if (r != null) {
                            if (stopWatchLastTyping.get_ms() > 1000) {
                                stopWatchLastTyping.Reset();
                                jObject.put("from", u.name);
                                r.sendMessage(u, jObject, true);
                            }
                        }
                    }
                }
            }

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void video(JSONObject jObject) throws Exception {
        if (user != null && !user.isEnqueued()) {
            User u = user.get();
            if (u.active && u.name != null) {
                if (this.room != null && !this.room.isEnqueued()) {
                    Room r = room.get();
                    if (r != null) {
                        if (r.type == Room.Type.VideoDynamic || r.type == Room.Type.VideoStatic) {
                            User toUser = r.getUser(jObject.getString("to"));
                            AsynchronousSender as = r.getAsynchronousSender(toUser);
                            if (toUser != null && toUser.name != null && as != null) {
                                String webcamType = jObject.getString("webcam_type");
                                if (webcamType.equals("ready")) {
                                    if (VideoConnectionSynchronizer.isReady(toUser.name, u.name)) {
                                        JSONObject jObjectReply = new JSONObject();
                                        jObjectReply.put("type", "video");
                                        jObjectReply.put("webcam_type", "do_connect");
                                        jObjectReply.put("from", u.name);
                                        jObjectReply.put("to", toUser.name);
                                        as.send(jObjectReply);
                                    }
                                } else {
                                    as.send((jObject));

                                }
                            }
                        } else {
                            r.sendMessage(u, jObject, true);
                        }
                        //if(jObject.getString("webcam_type").equals("request"))
                        //{
                        //    VideoPms.openForOtherUser(u, r , jObject);
                        //}
                    }
                }
            }
        }

    }

    private void uploadImage(JSONObject jObject) throws Exception {
        if (user != null && !user.isEnqueued()) {
            User u = user.get();
            if (u.active && u.name != null) {
                if (this.room != null && !this.room.isEnqueued()) {
                    Room r = room.get();
                    if (r != null) {
                        String relativePath = null;
                        Base64.Decoder decoder = Base64.getDecoder();
                        JSONObject jObjectReplySender = new JSONObject();
                        boolean successful = false;
                        String reason = "A generic error occured!";
                        jObjectReplySender.put("type", "upload_image");
                        if (stopWatchImage.get_ms() > 30000) {
                            stopWatchImage.Reset();
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
                                                    reason = "image cropping failed!";
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
                            reason = "You can only upload one image every 30 seconds!";
                        }
                        jObjectReplySender.put("successful", successful);
                        if (successful) {

                            JSONObject jObjectReply = new JSONObject();
                            jObjectReply.put("type", "image");
                            jObjectReply.put("path", relativePath);
                            jObjectReply.put("name", u.name);
                            r.sendMessage(u, jObjectReply, false);
                        } else {
                            jObjectReplySender.put("reason", reason);
                        }
                        asynchronousSender.send(jObjectReplySender);
                    } else {
                        r.sendMessage(u, jObject, true);
                    }

                    //if(jObject.getString("webcam_type").equals("request"))
                    //{
                    //    VideoPms.openForOtherUser(u, r , jObject);
                    //}
                }
            }
        }

    }

    public void close() {
        if (room != null && user != null) {
            if (!room.isEnqueued() && !user.isEnqueued()) {
                try {
                    room.get().remove(user.get());
                    room.get().sendUsers();
                } catch (Exception ex) {

                }
            }
        }
    }
}
