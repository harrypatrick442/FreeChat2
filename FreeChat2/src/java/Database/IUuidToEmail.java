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

/**
 *
 * @author EngineeringStudent
 */
public interface IUuidToEmail {

    public String getEmailFromUuid(UUID uuid) throws Exception;

    public UUID getUuidFromEmail(String email) throws Exception;

    public void addOrReplace(UUID u, String email) throws Exception;

    public void delete(UUID u) throws Exception;

    public void delete(String email) throws Exception;
}
