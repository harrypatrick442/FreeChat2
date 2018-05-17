/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.AuthenticationInfo;
import Database.UUID;
import MyWeb.GuarbageWatch;
import MySocket.AsynchronousSender;
import MySocket.IGetAsynchronousSender;
import MyWeb.Tuple;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import Profiles.IDatabase;
import org.mindrot.jbcrypt.BCrypt;

public class Room implements Serializable {

    public UUID id;
    private IGetAsynchronousSender iGetAsynchronousSender;

    public Room(IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender) throws Exception {
        GuarbageWatch.add(this);
        this.id = iDatabase.getRoomUuidToInfo().getUnusedUuid();
        this.iGetAsynchronousSender = iGetAsynchronousSender;
    }

    public Room(UUID id, IGetAsynchronousSender iGetAsynchronousSender) {
        GuarbageWatch.add(this);
        this.id = id;
        this.iGetAsynchronousSender = iGetAsynchronousSender;
    }
    
    public RoomInfo getInfo(IDatabase iDatabase) throws Exception{
        System.out.println(id.toString());
        return iDatabase.getRoomUuidToInfo().get(id);
    }
    /*public AsynchronousSender getAsynchronousSender(User user) {
     return iGetAsynchronousSender.getAsynchronousSender();
     }*/
    public void sendChatMessage(User user, JSONObject jObjectMessage, IDatabase iDatabase) throws Exception {
        addMessageToHistory(user, jObjectMessage, iDatabase);
        Iterator<Tuple<User, String>> iterator = iDatabase.getRoomUuidToUsers().get(id).iterator();
        while (iterator.hasNext()) {
            try {
                iGetAsynchronousSender.getAsynchronousSender(id, iterator.next().y).send(jObjectMessage);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

    }

    public void send(JSONObject jObject, List<AsynchronousSender> asynchronousSenders) throws Exception {
        Iterator<AsynchronousSender> iterator = asynchronousSenders.iterator();
        while (iterator.hasNext()) {
            try {
                iterator.next().send(jObject);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    private void addMessageToHistory(User user, JSONObject jObject, IDatabase iDatabase) throws Exception {
        iDatabase.getRoomUuidToMessages().add(id, user.id, jObject.toString(), System.currentTimeMillis());
    }

    public List<JSONObject> getHistory(IDatabase iDatabase) throws Exception {
        List<JSONObject> returns = new ArrayList<JSONObject>();
        for (String message : iDatabase.getRoomUuidToMessages().getNMessages(id, 40)) {
            returns.add(new JSONObject(message));
        }
        return returns;
    }

    public int getNUsers(IDatabase iDatabase) throws Exception {
        return iDatabase.getRoomUuidToUsers().getNUsers(id);
    }

    public void addUser(User user, AsynchronousSender asynchronousSender, IDatabase iDatabase) throws Exception {
        iDatabase.getRoomUuidToUsers().add(id, user.id, asynchronousSender.getName());
        sendUsers(iDatabase);
    }

    public void removeUser(User user, IDatabase iDatabase) throws Exception {
        iDatabase.getRoomUuidToUsers().remove(id, user.id);
        sendUsers(iDatabase);
    }

    public Boolean validatePassword(String password, IDatabase iDatabase) throws Exception {
        AuthenticationInfo authenticationInfo = iDatabase.getRoomUuidToAuthenticationInfo().get(id);
        if (authenticationInfo != null) {
            if (BCrypt.checkpw(password, authenticationInfo.getHash())) {
                return true;
            }
        }
        return false;
    }

    public Boolean hasPassword(IDatabase iDatabase) throws Exception {
        return getInfo(iDatabase).passwordProtected;
    }

    public List<Tuple<User, String>> getUsers(IDatabase iDatabase) throws Exception {
        return iDatabase.getRoomUuidToUsers().get(id);
    }
    
    public List<JSONObject> getAdminMessages() {
        return new ArrayList<JSONObject>();
    }

    public JSONObject getJSONObject(IDatabase iDatabase) throws JSONException, Exception {
        RoomInfo roomInfo = getInfo(iDatabase);
        System.out.println(roomInfo);
        JSONObject jObject = new JSONObject();
        jObject.put("name", roomInfo.name);
        jObject.put("id", id);
        jObject.put("has_password", roomInfo.passwordProtected);
        jObject.put("type", roomInfo.roomType.toString());
        return jObject;
    }

    private void sendUsers(IDatabase iDatabase) throws Exception {
        try {
            JSONObject jObject = new JSONObject();
            jObject.put("type", "users");
            JSONArray jArrayUsers = new JSONArray();
            List<AsynchronousSender> asynchronousSenders = new ArrayList<AsynchronousSender>();
            Iterator<Tuple<User, String>> iterator = iDatabase.getRoomUuidToUsers().get(id).iterator();
            while (iterator.hasNext()) {
                Tuple<User, String> pair = iterator.next();
                asynchronousSenders.add(iGetAsynchronousSender.getAsynchronousSender(id, pair.y));
                JSONObject jObjectUser = pair.x.getJSONObject(iDatabase);
                if (jObjectUser != null) {
                    jArrayUsers.put(jObjectUser);
                }
            }
            jObject.put("users", jArrayUsers);
            send(jObject, asynchronousSenders);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
