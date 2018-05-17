/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUuidToAbout;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToAbout;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToAbout extends Table implements IUuidToAbout {

    public TableUuidToAbout(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_about`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`about` TEXT,"
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexUserId` (`userId`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_about_get_about_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_about_get_about_from_uuid`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_about where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_about_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_about_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN aboutIn TEXT"
            + ")INSERT INTO uuid_to_about(userId, about) VALUES(UNHEX(userIdIn),aboutIn)ON DUPLICATE KEY UPDATE about=aboutIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_about_delete_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_about_delete_from_uuid` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_about WHERE userId =UNHEX(userIdIn);"};
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
            String str = "CALL `uuid_to_about_get_about_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("about");
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
    public void addOrReplace(UUID u, String about) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_about_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, about);
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
            String str = "CALL `uuid_to_about_delete_from_uuid`(?);";
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
            String about = get(uuid);
            if (about.equals("test")) {
                delete(uuid);
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
