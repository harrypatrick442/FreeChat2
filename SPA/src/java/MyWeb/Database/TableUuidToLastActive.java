/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.AuthenticationInfo;
import Database.IConnectionsPool;
import Database.IUuidToAuthenticationInfo;
import Database.IUuidToLastActive;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToLastActive extends Table implements  IUuidToLastActive {

    public TableUuidToLastActive(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_last_active`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`lastActive` BIGINT(20), "
            + "INDEX ` indexUserId` (`userId`),"
            + "INDEX ` indexLastActive` (`lastActive`),"
            + "PRIMARY KEY (`userId`)"
            + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_last_active_get`; ",
            "CREATE PROCEDURE `uuid_to_last_active_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_last_active where userId=UNHEX(userIdIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_last_active_set`; ",
            "CREATE PROCEDURE `uuid_to_last_active_set` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN lastActiveIn BIGINT(20)"
            + ")INSERT INTO uuid_to_last_active(userId, lastActive) VALUES(UNHEX(userIdIn) ,  lastActiveIn)ON DUPLICATE   KEY UPDATE lastActive=lastActiveIn;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_last_active_delete`; ",
            "CREATE PROCEDURE `uuid_to_last_active_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_last_active WHERE userId =UNHEX(userIdIn);"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs)
                st.executeUpdate(str);
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

    @Override
    public Long get(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_last_active_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getLong("lastActive");
            }
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
    public void set(UUID u, long millis) throws Exception {

        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `uuid_to_last_active_set`(?, ?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setLong(  2, millis);
            st.executeUpdate();
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

    public void delete(UUID u) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `uuid_to_last_active_delete`(?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.executeUpdate();
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

    public Boolean test() throws Exception {
        UUID uuid = new UUID("abcdefabcdefabcdefabcdefabcdefab");
        try {
            if (get(uuid) != null) {
                delete(uuid);
            }
            set(uuid, 10000);
            Long millis = get(uuid);
            if (millis==10000) {
                delete(uuid);
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
