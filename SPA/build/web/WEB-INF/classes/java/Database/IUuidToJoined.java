/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author SoftwareEngineer
 */
 public interface IUuidToJoined {
    public Long get(UUID uuid) throws Exception ;
    public void set(UUID u, long millis) throws Exception ;
    public void delete(UUID u) throws Exception ;
}
