/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.IPmUuidsToRoomUuid;
import Database.IUuidToUsername;
import Database.Notification;
import Database.UUID;
import MySocket.AsynchronousSender;
import MySocket.IGetAsynchronousSender;
import MyWeb.Configuration;
import MyWeb.Database.Database;
import Profiles.AuthenticationHelper;
import Profiles.IDatabase;
import Profiles.Result;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class NotificationsHelper {

    public static void sendNotifications(User user, IDatabase iDatabase, AsynchronousSender asynchronousSender) throws Exception{
        JSONObject jObject = new JSONObject();
        jObject.put("type", "notifications");
        JSONArray jArray = new JSONArray();
        jObject.put("notifications", jArray);
        for(Notification notification : iDatabase.getUuidToNotifications().get(user.id)){
            jArray.put(notification.getJSONObject());
        } 
        asynchronousSender.send(jObject);
    }
}
