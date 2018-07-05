/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.Interpreter;
import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import MyWeb.Sessions.Session;
import java.io.Serializable;
import java.lang.ref.WeakReference;
import java.util.Iterator;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterWall extends Interpreter implements Serializable {
    
    private AsynchronousSender asynchronousSender;
    private WeakReference<Wall> wall;
    private WeakReference<User> user;
    private String lastMessage = null;
    private StopWatch stopWatchImage = new StopWatch();
    private String ip;

    public InterpreterWall(AsynchronousSender asynchronousSender, String ip) {
       GuarbageWatch.add(this) ;
        this.asynchronousSender = asynchronousSender;
        this.ip = ip;
    }

    public void interpret(JSONObject jObject, Session session) throws Exception {
        try {

            String type = jObject.getString("type");
            if (type.equals("connect")) {
                //connect(jObject);
            } else { 
                if (type.equals("data")) {
               // data(jObject);
            } else {
            }
            }
        } catch (Exception ex) {
            throw ex;
        }
    }/*

    private void connect(JSONObject jObject) throws Exception {
                    /*
try {
            JSONObject jObjectReply = new JSONObject();
            boolean successful = true;
            jObjectReply.put("type", "connect");
            boolean sendUsers = false;
            Wall wall = null;
            User user = null;
            String reason = null;
            while (true) {
                String userId = jObject.getString("user_id");
                if (userId != null && userId != "") {
                    String wallId = jObject.getString("wall_id");
                    if (wallId != null) {
                        wall = Walls.get(wallId);
                        if (wall != null) {
                            this.wall = new WeakReference<Wall>(wall);
                            user = Users.userFromId(userId);
                            if (user != null) {
                                this.user = new WeakReference<User>(user);
                                if (wall.passwordProtected) {
                                    String password = jObject.getString("password");
                                    if (password != null && password.equals(wall.password)) {
                                        wall.add(user, asynchronousSender);
                                        user.addWallIn(wallId, wall);
                                        sendUsers = true;
                                        break;

                                    } else {
                                        reason = "Wrong password!";
                                    }
                                } else {
                                    wall.add(user, asynchronousSender);
                                    user.addWallIn(wallId, wall);
                                    sendUsers = true;
                                    break;
                                }
                            } else {

                            }
                        } else {
                            reason = "Wall no longer exists!";
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
                wall.sendUsers();
            }
            if (successful) {
                postAddUserOperations(wall, user);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }
        
    private void data(JSONObject jObject)throws Exception {
        if (user != null && !user.isEnqueued()) {
            User u = user.get();
            if (u.active && u.name != null) {
                if (this.wall != null && !this.wall.isEnqueued()) {
                    Wall w = wall.get();
                    if (w != null) {
                            User toUser = w.getUser(jObject.getString("to"));
                            AsynchronousSender as = w.getAsynchronousSender(toUser);
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
                    }
                }
            }
        }
}
    private void postAddUserOperations(Wall wall, User user) throws Exception {
        switch (wall.type) {
            default:
                if (!wall.passwordProtected) {
                    sendHistory(wall, user);
                }
                sendAdminMessages(wall, user);
                break;

        }
    }

    private void sendHistory(Wall wall, User user) {
        Iterator<JSONObject> iterator = wall.getHistory().iterator();
        AsynchronousSender as = wall.getAsynchronousSender(user);
        while (iterator.hasNext()) {
            as.send(iterator.next());
        }
    }

    private void sendAdminMessages(Wall wall, User user)
    {
        wall.getAsynchronousSender(user).send(wall.getAdminMessages());
    }
    public void close() {
        if (wall != null && user != null) {
            if (!wall.isEnqueued() && !user.isEnqueued()) {
                try {
                    wall.get().remove(user.get());
                    wall.get().sendUsers();
                } catch (Exception ex) {

                }
            }
        }
    }*/

    @Override
    public void close(Session session) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
