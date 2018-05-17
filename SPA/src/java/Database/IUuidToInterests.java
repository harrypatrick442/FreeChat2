/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Database.TableUuidToEmail;
import MyWeb.Tuple;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public interface IUuidToInterests {
    public JSONObject getJsonFromUuid(UUID uuid) throws Exception ;
    public void set(UUID u, JSONObject jObject) throws Exception ;
    public void delete(UUID uuid) throws Exception ;
}
