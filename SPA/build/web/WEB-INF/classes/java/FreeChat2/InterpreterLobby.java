/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.IUserUuidToSession;
import Database.UUID;
import MyWeb.Interpreter;
import MyWeb.ImageProcessing;
import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import MySocket.AsynchronousSenders;
import MySocket.AsynchronousSendersSet;
import MySocket.IGetAsynchronousSenders;
import MySocket.ISend;
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

    private String ip;
    private User user;
    private StopWatch stopWatchProfilePicture = new StopWatch();
    private ISend iSend = AsynchronousSendersSet.Empty;
    private AsynchronousSender asynchronousSender;

    public InterpreterLobby(AsynchronousSender asynchronousSender, IGetIp iGetIp) {
        GuarbageWatch.add(this);
        this.ip = iGetIp.getIp();
        this.asynchronousSender = asynchronousSender;
        iSend = asynchronousSender;
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
                        if (type.equals("clear_notification")) {
                            clearNotification(jObject, session);
                        } else {
                            if (type.equals("pm")) {
                                pm(jObject, session);
                            } else {
                                if (type.equals("get_notifications")) {
                                    System.out.println("get_notifications");
                                    getNotifications(session);
                                } else {
                                    if (type.equals("video_pm")) {
                                        videoPm(jObject);
                                    } else {
                                        if (type.equals("create_room")) {
                                            createRoom(jObject, session);
                                        }
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
            //User user = authenticate(session);
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "connect");
            //jObjectReply.put("user_id", user.id);
            asynchronousSender.send(jObjectReply);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void getRooms() throws Exception {
        asynchronousSender.send(Rooms.getPopularJSONObject(Database.getInstance(), AsynchronousSenders.getInstance()));
    }

    private void getNotifications(Session session) throws Exception {
        authenticate(session);
        if (user != null) {
            NotificationsHelper.sendNotifications(user, Database.getInstance(), asynchronousSender);
        }
    }

    private void clearNotification(JSONObject jObject, Session session) throws Exception {
        authenticate(session);
        if (user != null) {
            NotificationsHelper.clearNotification(user, new UUID(jObject.getString("roomUuid")), Database.getInstance());
        }
    }

    private void users(boolean toAll) throws Exception {
        try {
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "users");
            jObjectReply.put("users", Users.getAllJSONArray(Database.getInstance()));
            if (toAll) {
                Users.sendMessageToAllOnline(jObjectReply, Database.getInstance(), AsynchronousSenders.getInstance());
            } else {
                iSend.send(jObjectReply);
            }
        } catch (JSONException ex) {
            throw ex;
        }
    }

    private void pm(JSONObject jObject, Session session) throws Exception {
        try {
            authenticate(session);
            if (user == null) {
                return;
            }

            UUID otherUserId = new UUID(jObject.getString("otherUserId"));
            if (otherUserId == null) {
                return;
            }
            Room room = PmsHelper.getOrCreate(otherUserId, user.id, Database.getInstance(), AsynchronousSenders.getInstance());
            if (room != null) {
                JSONObject jObjectReply = room.getInfo(Database.getInstance()).getJSONObject();
                jObjectReply.put("show", true);
                asynchronousSender.send(jObjectReply);
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
            authenticate(session);
            boolean successful = false;
            if (user != null) {
                String name = jObject.getString("name");
                boolean hasPassword = jObject.getBoolean("has_password");
                try {
                    IGetAsynchronousSenders i = AsynchronousSenders.getInstance();
                    Rooms.createNew(name, RoomType.Text, hasPassword, hasPassword ? jObject.getString("password") : null, Database.getInstance(), i);
                    successful = true;
                    Users.sendMessageToAllOnline(Rooms.getPopularJSONObject(Database.getInstance(), AsynchronousSenders.getInstance()), Database.getInstance(), AsynchronousSenders.getInstance());
                } catch (RoomCreationException ex) {
                    reason = ex.toString();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                reason = "You must be signed in to create a room!";
            }
            jObjectReply.put("successful", successful);
            jObjectReply.put("reason", reason);
            iSend.send(jObjectReply);
        } catch (JSONException ex) {
            throw ex;
        }
    }

    @Override
    public void close(Session session) {
        if (user != null) {
            try {
                System.out.println("remove");
                IUserUuidToSession s = Database.getInstance().getUserUuidToSession();
                s.delete(session.id);
                if (s.getIsLastSession(user.id, session.id)) {
                    Database.getInstance().getLobbyToUsers().remove(user.id);
                    s.clearUserSessions(user.id);
                }
                users(true);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void preSendAuthenticationReply(String username, Boolean successful, Profiles.User user) throws Exception {
        if (successful) {
            System.out.println("authentication user is: " + user.getUuid());
            iSend = AsynchronousSenders.getInstance().add(asynchronousSender, user.getUuid());
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
