/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.Database.Database;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class RoomInfo {

    public final String name;
    public final Boolean passwordProtected;
    public final RoomType roomType;
    public final String pmUsernamesJSON;
    public final UUID uuid;

    public RoomInfo(UUID uuid, String name, Boolean passwordProtected, RoomType roomType, String pmUsernamesJSON) {
        this.uuid = uuid;
        this.name = name;
        this.passwordProtected = passwordProtected;
        this.roomType = roomType;
        this.pmUsernamesJSON = pmUsernamesJSON;
    }

    public JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        jObject.put("roomUuid", uuid);
        jObject.put("type", roomType);
        if (pmUsernamesJSON != null) {
            jObject.put("usernames", new JSONArray(pmUsernamesJSON));
        }
        jObject.put("name", name);
        return jObject;
    }
}
