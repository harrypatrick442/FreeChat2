/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUuidToStatus;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToStatus;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToStatus extends Table implements IUuidToStatus {

    public TableUuidToStatus(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_status`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`status` VARCHAR(255),"
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexStatus` (`status`),"
            + "INDEX `indexUserId` (`userId`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_status_get_status_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_status_get_status_from_uuid`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_status where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_status_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_status_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN statusIn VARCHAR(255)"
            + ")INSERT INTO uuid_to_status(userId, status) VALUES(UNHEX(userIdIn),statusIn)ON DUPLICATE KEY UPDATE status=statusIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_status_delete_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_status_delete_from_uuid` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_status WHERE userId =UNHEX(userIdIn);"};
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

    @Override
    public String get(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_status_get_status_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("status");
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
    public void addOrReplace(UUID u, String status) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_status_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2,status);
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

    public void delete(UUID u) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_status_delete_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
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

    public Boolean test() throws Exception {
        UUID uuid = new UUID("abcdefabcdefabcdefabcdefabcdefab");
        try {
            if (get(uuid) != null) {
                delete(uuid);
            }

            addOrReplace(uuid, "test");
            String status = get(uuid);
            if (status.equals("test")) {
                delete(uuid);
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
