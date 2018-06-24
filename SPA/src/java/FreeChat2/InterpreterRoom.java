/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.Interpreter;
import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import MySocket.AsynchronousSenders;
import MySocket.AsynchronousSendersSet;
import MySocket.ISend;
import MyWeb.Database.Database;
import MyWeb.IGetIp;
import MyWeb.ImageProcessing;
import MyWeb.Sessions.Session;
import Profiles.IDatabase;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.Base64;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterRoom extends Interpreter implements Serializable {

    private AsynchronousSender asynchronousSender;
    private ISend iSend = AsynchronousSendersSet.Empty;
    private StopWatch stopWatchLastTyping = new StopWatch();
    private StopWatch stopWatchLastMessage = new StopWatch();
    private String lastMessage = null;
    private StopWatch stopWatchImage = new StopWatch();
    private String ip;
    private User user;
    private Room room;

    public InterpreterRoom(AsynchronousSender asynchronousSender, IGetIp iGetIp) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
        iSend = asynchronousSender;
        this.ip = iGetIp.getIp();
    }

    @Override
    public void interpret(JSONObject jObject, Session session) throws Exception {
        try {
            System.out.println("InterpreterRoom");
            
            String type = jObject.getString("type");
            System.out.println("type");
            if (type.equals("message")) {
                message(jObject);
            } else {
                if (type.equals("typing")) {
                    typing(jObject);
                } else {
                    if (type.equals("sound")) {
                        sound(jObject);
                    } else {
                        if (type.equals("connect")) {
                            connect(jObject, session);
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
    private void authenticate(JSONObject jObject, Session session) throws Exception{
            System.out.println("just validated");
        if(session!=null)
        {
            System.out.println("just validated");
            user = Users.validate(session.id, Database.getInstance());
            if(user!=null)
            {
                System.out.println("user was not null and adding asynchronous sender");
                System.out.println(asynchronousSender);
                System.out.println(user.id);
                iSend = AsynchronousSenders.getInstance().add(asynchronousSender, user.id);
            }
        }
    }
    private void connect(JSONObject jObject, Session session) throws Exception {
        try {
            System.out.println("doing connect _34232");
            IDatabase iDatabase = Database.getInstance();
            authenticate(jObject, session);
            JSONObject jObjectReply = new JSONObject();
            boolean successful = true;
            jObjectReply.put("type", "connect");
            String reason = null;
            while (true) {
                UUID roomId = new UUID(jObject.getString("roomUuid"));
                if (user != null) {
                    room = Rooms.get(roomId, AsynchronousSenders.getInstance());
                    System.out.println("room: ");
                    System.out.println(room.id);
                    if (room.hasPassword(iDatabase)) {
                        if (room.validatePassword(jObject.getString("password"), Database.getInstance())) {
                            room.addUser(user, asynchronousSender, Database.getInstance());
                            break;

                        } else {
                            reason = "Wrong password!";
                        }
                    } else {
                        room.addUser(user, asynchronousSender, Database.getInstance());
                        break;
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
            if (successful) {
                sendHistory(iDatabase);
                postAddUserOperations(room.getInfo(iDatabase), asynchronousSender);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    private void sendHistory(IDatabase iDatabase) throws Exception {
        System.out.println("sendHistory");
        Iterator<JSONObject> iterator = room.getHistory(iDatabase).iterator();
        while (iterator.hasNext()) {
            System.out.println("send");
            asynchronousSender.send(iterator.next());
        }
    }
    private void postAddUserOperations(RoomInfo roomInfo, AsynchronousSender asynchronousSender) throws Exception {
        switch (roomInfo.roomType) {
            case VideoPM:
                if (room.getNUsers(Database.getInstance()) >= 2) {
                    //VideoPms.sendVideoConnect(room);
                }
                break;
            case Text:
                asynchronousSender.send(room.getAdminMessages());
                break;

        }
        sendFinishedLoading(room, asynchronousSender);
    }

    private void sendFinishedLoading(Room room, AsynchronousSender asynchronousSender) {
        JSONObject jObject = new JSONObject();
        try {
            jObject.put("type", "finished_loading");
            asynchronousSender.send(jObject);
        } catch (JSONException ex) {
        }
    }

    private void message(JSONObject jObject) throws Exception {
        try {
            if (stopWatchLastMessage.get_ms() > 1000) {
                if (user != null && room != null) {
                    jObject.put("userId", user.id);
                    if(jObject.has("notify")){
                        PmsHelper.notifyOtherUser(user, Database.getInstance(), AsynchronousSenders.getInstance(), room);
                        jObject.remove("notify");
                    }
                    room.sendChatMessage(user, jObject, Database.getInstance());
                }
            }
            stopWatchLastMessage.Reset();
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void sound(JSONObject jObject) throws Exception {
        try {
            if (user != null && room != null) {
                jObject.put("from", user.getName(Database.getInstance()));
                room.sendMessage(jObject, Database.getInstance());
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void typing(JSONObject jObject) throws Exception {
        try {
            if (user != null && room != null) {
                if (stopWatchLastTyping.get_ms() > 1000) {
                    stopWatchLastTyping.Reset();
                    jObject.put("from", user.getName(Database.getInstance()));
                    room.sendMessage(jObject, Database.getInstance(), user);
                }
            }

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void video(JSONObject jObject) throws Exception {
        /*
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
         }*/

    }

    private void uploadImage(JSONObject jObject) throws Exception {
        if (user != null && room != null) {
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
                IDatabase iDatabase = Database.getInstance();
                JSONObject jObjectReply = new JSONObject();
                jObjectReply.put("type", "image");
                jObjectReply.put("path", relativePath);
                jObjectReply.put("name", user.getName(iDatabase));
                room.sendMessage(jObjectReply, iDatabase);
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

    public void close() {
        try {
                if(Database.getInstance().getUserUuidToSession().getIsLastSession(user.id))
            Database.getInstance().getRoomUuidToUsers().remove(room.id, user.id);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
