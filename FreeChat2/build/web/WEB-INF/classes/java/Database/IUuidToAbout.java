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
public interface IUuidToAbout {
    public String get(UUID u) throws Exception;
    public void addOrReplace(UUID u, String about) throws Exception;

    public void delete(UUID u) throws Exception;
}
