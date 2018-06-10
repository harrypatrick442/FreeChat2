/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.GuarbageWatch;
import Profiles.IDatabase;
import java.io.Serializable;
import org.apache.commons.lang.NotImplementedException;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class User  implements Serializable{

    public UUID id;
    public User(UUID id) {
       GuarbageWatch.add(this) ;
        this.id=id;
    }

    public void setName(String name, IDatabase iDatabase) throws Exception {
        iDatabase.getUuidToUsername().addOrReplace(id, name);
    }
    public String getName(IDatabase iDatabase) throws Exception{
        return iDatabase.getUuidToUsername().getUsernameFromUuid(id);
    }

    public JSONObject getJSONObject(IDatabase iDatabase) throws JSONException, Exception {
        return iDatabase.getProfiles().getUserEntry(id);
    }
    @Override
    public boolean equals(Object o) {

        if (o == this) return true;
        if (!(o instanceof User)) {
            return false;
        }
        User user = (User) o;
        return user.id.equals(this.id);
    }
}
