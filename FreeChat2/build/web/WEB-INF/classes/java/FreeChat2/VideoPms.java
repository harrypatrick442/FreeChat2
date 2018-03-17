/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class VideoPms {

    public static Map<String, String> mapUsersNamesToRoomId = new HashMap<String, String>();
    public static Map<String, String[]> mapRoomIdToUsersNames = new HashMap<String, String[]>();

    public static void add(String user1, String user2, String id) {
        String usersNameCombination = user1 + "_" + user2;
        mapUsersNamesToRoomId.put(usersNameCombination, id);
        mapRoomIdToUsersNames.put(id, new String[]{user1, user2});
    }

    public static String getId(String user1, String user2) {
        String combination = user1 + "_" + user2;
        String id = mapUsersNamesToRoomId.get(combination);
        if (id != null) {
            return id;
        } else {
            combination = user2 + "_" + user1;
            id = mapUsersNamesToRoomId.get(combination);
            return id;
        }
    }

    public static void removeId(String id) {
        String[] names = mapRoomIdToUsersNames.get(id);
        if (names != null) {
            mapUsersNamesToRoomId.remove(names[0] + "_" + names[1]);
        }
        mapRoomIdToUsersNames.remove(id);
    }

    public static void openForOtherUser(User me, Room room, JSONObject jObjectMessage) throws JSONException {
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "video_pm");
        jObjectReply.put("username", me.name);
        String[] names = mapRoomIdToUsersNames.get(room.id);
        String name;
        if (names[0] == me.name) {
            name = names[1];
        } else {
            name = names[0];
        }
        jObjectReply.put("other_username", name);
        jObjectReply.put("message", jObjectMessage);
        jObjectReply.put("id", room.id);
        Users.userFromName(name).asynchronousSender.send(jObjectReply);
    }

    public static void open(String otherUsername, User userMe) throws Exception {
        String username = userMe.name;
        String combination = username + "_" + otherUsername;
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "video_pm");
        if (username != null) {
            jObjectReply.put("username", username);
            jObjectReply.put("other_username", otherUsername);
            String id = getId(username, otherUsername);
            Room room = null;
            if (id != null) {
                room = Rooms.get(id);
            }
            if (room == null) {
                id = Rooms.getUniqueId();
                room = new Room(id, combination, Room.Type.VideoPM);
                add(username, otherUsername, id);
                Rooms.add(room);
            }
            jObjectReply.put("id", room.id);
            Users.userFromName(otherUsername).asynchronousSender.send(jObjectReply);
            jObjectReply = new JSONObject(jObjectReply.toString());
            jObjectReply.put("accepted", true);
            userMe.asynchronousSender.send(jObjectReply);
            if (room.getNUsers() >= 2) {
                VideoPms.sendVideoConnect(room);
            }
        }
    }

    public static void sendVideoConnect(Room room) throws Exception {
        JSONObject jObject = new JSONObject();
        jObject.put("type", "video");
        jObject.put("webcam_type", "video_connect");
        room.sendMessage(jObject);
    }

}
