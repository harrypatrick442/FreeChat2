/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Database.TableUuidToEmail;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
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
