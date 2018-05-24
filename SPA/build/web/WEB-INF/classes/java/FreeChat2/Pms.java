/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MySocket.IGetAsynchronousSender;
import MyWeb.Tuple;
import Profiles.IDatabase;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Pms {


    public static Room getRoom(UUID user1Uuid, UUID user2Uuid, IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender) throws Exception {
        return new Room(iDatabase.getPmUuidsToRoomUuid().getRoomUuid(user1Uuid, user2Uuid), iGetAsynchronousSender);
    }

    /*public static void removeId(String id) {
        String[] ids = mapRoomIdToUsersIds.get(id);
        if (ids != null) {
            mapUsersUniqueUuidsToRoomId.remove(ids[0]+"_"+ids[1]);
        }
        mapRoomIdToUsersIds.remove(id);
    }*/
       public static void reopen(User me, Room room, IDatabase iDatabase) throws JSONException, Exception
       {
/*//change all this.
           //Room opens just like other rooms, except instead of id, it has two user id's and object property telling it that it is a pm.
           //the client side has knowledge of which rooms are pm.
           //object to other client with pm user ids or room id telling them they got pm if they are not in room..
           
            JSONObject jObjectReply = new JSONObject();
            jObjectReply.put("type", "pm");
            jObjectReply.put("userId", me.id);
            System.out.println("id being obtained is: "+room.id);
            Tuple<UUID, UUID> userUuids = iDatabase.getPmUuidsToRoomUuid().getUserUuids(room.id);
            UUID otherUniqueId=(userUuids.x==me.id?userUuids.y:userUuids.x);
            jObjectReply.put("otherUserId", otherUniqueId);
            jObjectReply.put("id", room.id);
            jObjectReply.put("message", jObjectMessage);
            User otherUser = Users.userFromId(otherUniqueId);
            if (otherUser != null) {
                otherUser.asynchronousSender.send(jObjectReply);
            }
  */      }
    public static void open(UUID otherUniqueId, User userMe, IDatabase iDatabase) throws Exception {
        /*UUID id = userMe.id;
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "pm");
        if (id != null) {
            jObjectReply.put("userId", id);
            jObjectReply.put("otherUserId", otherUniqueId);
            UUID roomId = getId(id, otherUniqueId, iDatabase);
            Room room = null;
            if (roomId != null) {
                room = Rooms.get(roomId);
            }
            if (room == null) {
                room = Rooms.createNew(id+"_"+otherUniqueId , Room.Type.PM);
                iDatabase.getPmUuidsToRoomUuid().add(room.id, id, otherUniqueId);
                Rooms.add(room);
            }
            jObjectReply.put("id", room.id);
            System.out.println("sending reply pm");
            System.out.println(jObjectReply.toString());
            userMe.asynchronousSender.send(jObjectReply);
            //User otherUser = Users.userFromId(otherUniqueId);
            //if (otherUser != null) {
            //    otherUser.asynchronousSender.send(str);
            //}
        }
    */}

}
