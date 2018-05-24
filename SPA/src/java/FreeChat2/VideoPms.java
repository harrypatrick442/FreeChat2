/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.Tuple;
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
/*
    public static Map<String, String> mapUsersUniqueIdsToRoomId = new HashMap<String, String>();
    public static Map<UUID, Tuple<UUID, UUID>> mapRoomIdToUsersIds = new HashMap<UUID, Tuple<UUID, UUID>>();

    public static void add(UUID userUuid1, UUID userUuid, UUID roomUuid) {
        //mapRoomIdToUsersIds.put(id, new Tuple<UUID, UUID>(user1, user2));
    }

    public static String getId(String user1, String user2) {
        String combination = user1 + "_" + user2;
        String id = mapUsersUniqueIdsToRoomId.get(combination);
        if (id != null) {
            return id;
        } else {
            combination = user2 + "_" + user1;
            id = mapUsersUniqueIdsToRoomId.get(combination);
            return id;
        }
    }

    public static void removeId(String id) {
        String[] ids = mapRoomIdToUsersIds.get(id);
        if (ids != null) {
            mapUsersUniqueIdsToRoomId.remove(ids[0] + "_" + ids[1]);
        }
        mapRoomIdToUsersIds.remove(id);
    }

    public static void openForOtherUser(User me, Room room, JSONObject jObjectMessage) throws JSONException {
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "video_pm");
        jObjectReply.put("userId", me.id);
        Tuple<UUID, UUID> userUuids= mapRoomIdToUsersIds.get(room.id);
        String otherUniqueId;
        if (ids[0] == me.id) {
            otherUniqueId = ids[1];
        } else {
            otherUniqueId = ids[0];
        }
        jObjectReply.put("otherUserId", otherUniqueId);
        jObjectReply.put("message", jObjectMessage);
        jObjectReply.put("id", room.id);
        Users.userFromId(otherUniqueId).asynchronousSender.send(jObjectReply);
    }

    public static void open(String otherUniqueId, User userMe) throws Exception {
        String id = userMe.id;
        String combination = id + "_" + otherUniqueId;
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "video_pm");
        if (id != null) {
            jObjectReply.put("userId", id);
            jObjectReply.put("otherUserId", otherUniqueId);
            String roomId = getId(id, otherUniqueId);
            Room room = null;
            if (roomId != null) {
                room = Rooms.get(roomId);
            }
            if (roomId == null) {
                roomId = Rooms.getUniqueId();
                room = new Room(roomId, combination, Room.Type.VideoPM);
                add(id, otherUniqueId, roomId);
                Rooms.add(room);
            }
            jObjectReply.put("id", room.id);
            Users.userFromId(otherUniqueId).asynchronousSender.send(jObjectReply);
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
    }*/

}
