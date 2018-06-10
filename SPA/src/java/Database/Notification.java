/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Notification{
    public final UUID roomUuid;
    public final String roomName;
    public final String type;
    public final String fromJSON;
    public Notification(UUID roomUuid, String roomName, String type, String fromJSON){
        this.fromJSON = fromJSON;
        this.roomUuid = roomUuid;
        this.roomName = roomName;
        this.type = type;
    }

    public JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        jObject.put("roomUuid", roomUuid);
        jObject.put("roomName", roomName);
        jObject.put("type", type);
        System.out.println("fromJSON");
        System.out.println(fromJSON);
        jObject.put("users", fromJSON!=null?new JSONArray(fromJSON):new JSONArray());
        return jObject;
    }
}
