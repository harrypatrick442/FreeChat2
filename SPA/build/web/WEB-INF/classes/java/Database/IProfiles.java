/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public interface IProfiles {

    public JSONObject get(String userId) throws Exception;

    public JSONObject get(UUID uuid, JSONObject jObject) throws Exception;

    public void delete(UUID u) throws Exception;
}
