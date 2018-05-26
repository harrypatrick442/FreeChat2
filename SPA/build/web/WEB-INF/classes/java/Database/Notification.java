/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Notification{
    public final UUID fromUuid;
    public final UUID roomUuid;
    public final String roomName;
    public Notification(UUID fromUuid, UUID roomUuid, String roomName){
        this.fromUuid = fromUuid;
        this.roomUuid = roomUuid;
        this.roomName = roomName;
    }

    public JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        jObject.put("fromUuid", fromUuid);
        jObject.put("roomUuid", roomUuid);
        jObject.put("roomName", roomName);
        return jObject;
        
    }
}
