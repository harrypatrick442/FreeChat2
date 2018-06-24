/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;
import java.sql.Connection;
import java.sql.SQLException;
import org.apache.tomcat.dbcp.dbcp.BasicDataSource;

/**
 *
 * @author EngineeringStudent
 */
public class ConnectionsPool implements IConnectionsPool {

    private BasicDataSource ds = new BasicDataSource();
    public ConnectionsPool(
            String jdbcDriver, String dbUrl, String user, String password, int minConnections, int maxConnections) {
                ds.setDriverClassName(jdbcDriver);
                ds.setUsername(user);
                ds.setPassword(password);
                ds.setUrl(dbUrl);
                
    }
    
    @Override
    public  Connection getConnection() throws SQLException{
        return ds.getConnection();
    }
}
