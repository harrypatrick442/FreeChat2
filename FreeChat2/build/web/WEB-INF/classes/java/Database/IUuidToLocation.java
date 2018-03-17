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
public interface IUuidToLocation {

    public String getFormattedAddress(UUID uuid) throws Exception;

    public void set(UUID u, String formattedAddress, int level5, int level6, int level7, int level8, int level9, int level10, int level11, int level12, int level13, int level14, long level15, long level16, long level17, long level18) throws Exception;

    public void delete(UUID u) throws Exception;
}
