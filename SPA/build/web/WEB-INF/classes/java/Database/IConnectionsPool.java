/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.sql.Connection;
import java.sql.SQLException;


/**
 *
 * @author EngineeringStudent
 */
public interface IConnectionsPool {
   public Connection getConnection () throws SQLException;
}
