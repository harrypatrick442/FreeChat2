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
        JSONObject jObject = new JSONObject();
        jObject.put("name", iDatabase.getUuidToUsername().getUsernameFromUuid(id));
        jObject.put("unique_id", id);
        /*if(picture!=null)
        {
            jObject.put("picture", picture);
        }*/
        return jObject;
    }

    void setPictureRelativePath(String relativePath, IDatabase instance) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
