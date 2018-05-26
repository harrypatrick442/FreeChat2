/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.IPmUuidsToRoomUuid;
import Database.IUuidToUsername;
import Database.UUID;
import MySocket.AsynchronousSender;
import MySocket.IGetAsynchronousSender;
import MyWeb.Configuration;
import MyWeb.Database.Database;
import Profiles.AuthenticationHelper;
import Profiles.IDatabase;
import Profiles.Result;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class PmsHelper {

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
    public static void reopen(User me, Room room, IDatabase iDatabase) throws JSONException, Exception {
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
         */    }
    public static void notifyOtherUser(User user, IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender, Room room) throws Exception{
        UUID otherUserId = iDatabase.getPmUuidsToRoomUuid()
                .getOtherUser(user.id, room.id);
        System.out.println(otherUserId);
        if(otherUserId==null)
            return;
        iDatabase.getUuidToNotifications().add(otherUserId, room.id, user.id);
        AsynchronousSender asynchronousSender = iGetAsynchronousSender.getAsynchronousSender(otherUserId, iDatabase.getLobbyToUsers().getEndpoint(otherUserId));
        if(asynchronousSender!=null)
        {
            JSONObject jObject = new JSONObject();
            jObject.put("type", "notify");
            jObject.put("fromUuid", user.id);
            jObject.put("roomUuid", room.id);
            jObject.put("roomName", room.getInfo(iDatabase).name);
            asynchronousSender.send(jObject);
        }
    }
    public static Room getOrCreate(UUID otherUserId, UUID userId, IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender) throws Exception {
        IPmUuidsToRoomUuid iPmUuidsToRoomUuid = iDatabase.getPmUuidsToRoomUuid();
        UUID roomUuid = iPmUuidsToRoomUuid.getRoomUuid(otherUserId, userId);
        if (roomUuid != null) {
            return new Room(roomUuid, iGetAsynchronousSender);
        }
        IUuidToUsername iUuidToUsername = iDatabase.getUuidToUsername();
        String otherUsername = iUuidToUsername.getUsernameFromUuid(otherUserId);
        if (otherUsername == null) {
            return null;
        }
        Room room =new Room(iDatabase, iGetAsynchronousSender);
        iDatabase.getRoomUuidToInfo().add(room.id, Configuration.PM_PREFIX + otherUsername, RoomType.PM.toString(), false);
        iPmUuidsToRoomUuid.add(room.id, otherUserId, userId);
        return room;
    }
}
