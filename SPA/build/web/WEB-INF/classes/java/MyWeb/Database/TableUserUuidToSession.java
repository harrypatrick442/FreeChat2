/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUserUuidToSession;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public class TableUserUuidToSession extends Table implements IUserUuidToSession {

    public TableUserUuidToSession(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `user_uuid_to_session`"
            + "("
            + "`userUuid` BINARY(16) NOT NULL,"            
            + "`sessionUuid` BINARY(16) NOT NULL,"        
            + "`createdTimestamp` BIGINT(20) NOT NULL,"           
            + "PRIMARY KEY (`userUuid`),"
            + "INDEX `indexUserUuid` (`userUuid`),"
            + "INDEX `indexSessionUuid` (`sessionUuid`),"            
            + "INDEX `indexCreatedTimestamp` (`createdTimestamp`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `user_uuid_to_session_get`; ",
            "CREATE PROCEDURE `user_uuid_to_session_get`("
            + "IN sessionUuidIn VARCHAR (32)"
            + ")"
            + "BEGIN "
            + "SELECT HEX(userUuid) FROM user_uuid_to_session WHERE sessionUuid=UNHEX(sessionUuidIn);"
            +" END;",
            "DROP PROCEDURE IF EXISTS `user_uuid_to_session_add`; ",
            "CREATE PROCEDURE `user_uuid_to_session_add`("
            + "IN userUuid VARCHAR(32),"
            + "IN sessionUuid VARCHAR(32),"
            + "IN createdTimestamp BIGINT(20)"
            + ")"
            + "BEGIN "
            + "INSERT INTO user_uuid_to_session(userUuid, sessionUuid, createdTimestamp) VALUES(UNHEX(userUuid), UNHEX(sessionUuid), createdTimestamp) ON DUPLICATE KEY UPDATE sessionUuid=UNHEX(sessionUuid), createdTimestamp = createdTimestamp;"
            +" END;",
            "DROP PROCEDURE IF EXISTS `user_uuid_to_session_delete`; ",
            "CREATE PROCEDURE `user_uuid_to_session_delete` ("
            + "IN sessionUuid VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "DELETE FROM user_uuid_to_session WHERE sessionUuid=UNHEX(sessionUuid);"
            + " END;"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs) {
                st.executeUpdate(str);
            }
        } catch (SQLException se) {
            se.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null) {
                    st.close();
                }
            } catch (SQLException se) {
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }
    }
    public UUID get(UUID sessionUuid) throws Exception{
     Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `user_uuid_to_session_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, sessionUuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                System.out.println("not returning null");
                return new UUID(rS.getString(1));
            }
            System.out.println("returning null as suspected");
                System.out.println(sessionUuid);
            System.out.println(".");
            return null;
        } catch (SQLException se) {
            se.printStackTrace();
            throw se;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                if (st != null) {
                    st.close();
                }
            } catch (SQLException se) {
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }
    }

    @Override
    public Boolean test() throws Exception{return true;
 
    }

    @Override
    public void map(UUID sessionUuid, UUID userUuid) throws    Exception{
     Connection conn = null;
        CallableStatement st = null;
        System.out.println("userUuid is: ");
        System.out.println(userUuid);
        try {
            conn = getConnection();
            //String str = "CALL `user_uuid_to_session_get`(?);";
            //st = conn.prepareCall(str);
            //while(true){
                //UUID uuid = new UUID();
                //st.setString(1, uuid.toString());
               // ResultSet rS = st.executeQuery();
                //if (!rS.next()) { 
                    String str = "CALL `user_uuid_to_session_add`(?,?,?);";
                    st = conn.prepareCall(str);
                    st.setString(1, userUuid.toString());
                    st.setString(2, sessionUuid.toString());
                    st.setLong(3, System.currentTimeMillis());
                    st.executeQuery();
                //}
            //}
        } catch (SQLException se) {
            se.printStackTrace();
            throw se;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                if (st != null) {
                    st.close();
                }
            } catch (SQLException se) {
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }
    }

    @Override
    public void delete(UUID sessionUuid) throws Exception{
     Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `user_uuid_to_session_delete`(?);";
            st = conn.prepareCall(str);
            st.setString(1, sessionUuid.toString());
            st.executeQuery();
        } catch (SQLException se) {
            se.printStackTrace();
            throw se;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                if (st != null) {
                    st.close();
                }
            } catch (SQLException se) {
            }
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }
    }

    @Override
    public List<UUID> getAllOnlineUserUuids() throws Exception {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}



