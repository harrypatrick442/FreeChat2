/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.AuthenticationInfo;
import Database.IConnectionsPool;
import Database.IUuidToAuthenticationInfo;
import Database.IUuidToJoined;
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
public class TableUuidToJoined extends Table implements  IUuidToJoined {

    public TableUuidToJoined(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {
                "CREATE TABLE IF NOT EXISTS `uuid_to_joined`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`joined` BIGINT(20), "
            + "INDEX `indexUserId` (`userId`),"
            + "INDEX `indexJoined` (`joined`),"
            + "PRIMARY KEY (`userId`)"
            + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_joined_get`; ",
            "CREATE PROCEDURE `uuid_to_joined_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_joined where userId=UNHEX(userIdIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_joined_set`; ",
            "CREATE PROCEDURE `uuid_to_joined_set` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN joinedIn BIGINT(20)"
            + ")INSERT INTO uuid_to_joined(userId, joined) VALUES(UNHEX(userIdIn) ,  joinedIn)ON DUPLICATE   KEY UPDATE joined=joinedIn;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_joined_delete`; ",
            "CREATE PROCEDURE `uuid_to_joined_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_joined WHERE userId =UNHEX(userIdIn);"};
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
            String str = "CALL `uuid_to_joined_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.getShortVersion());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getLong("joined");
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
            String str = "{CALL `uuid_to_joined_set`(?, ?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
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
            String str = "{CALL `uuid_to_joined_delete`(?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
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
