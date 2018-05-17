/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToEmail;
import java.sql.CallableStatement;
import java.sql.ResultSet;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToEmail extends Table implements IUuidToEmail {

    public TableUuidToEmail(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_email`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`email` VARCHAR(255),"
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexEmail` (`email`),"
            + "INDEX `indexUserId` (`userId`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_get_email_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_email_get_email_from_uuid`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_email where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_get_uuid_from_email`; ",
            "CREATE PROCEDURE `uuid_to_email_get_uuid_from_email` ("
            + " IN emailIn VARCHAR(255)"
            + ")select HEX(userId) as userId from uuid_to_email where email=emailIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_email_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN emailIn VARCHAR(255)"
            + ")INSERT INTO uuid_to_email(userId, email) VALUES(UNHEX(userIdIn),emailIn)ON DUPLICATE KEY UPDATE email=emailIn;",
             "DROP PROCEDURE IF EXISTS `uuid_to_email_delete_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_email_delete_from_uuid` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_email WHERE userId =UNHEX(userIdIn);",
             "DROP PROCEDURE IF EXISTS `uuid_to_email_delete_from_email`; ",
            "CREATE PROCEDURE `uuid_to_email_delete_from_email` ("
            + "IN emailIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_email WHERE email =emailIn;"};
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
    public String getEmailFromUuid(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_email_get_email_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("email");
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
    public UUID getUuidFromEmail(String email) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_email_get_uuid_from_email`(?);";
            st = conn.prepareCall(str);
            st.setString(1, email);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return new UUID(rS.getString("userId"));
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
    public void addOrReplace(UUID u, String email) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_email_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, email);
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
            String str = "CALL `uuid_to_email_delete_from_uuid`(?);";
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

    public void delete(String email) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_email_delete_from_email`(?);";
            st = conn.prepareCall(str);
            st.setString(1, email);
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
            if (getUuidFromEmail("test") != null) {
                delete("test");
            }
            if (getEmailFromUuid(uuid) != null) {
                delete(uuid);
            }

            if (getUuidFromEmail("test") == null) {
                addOrReplace(uuid, "test");
                String email = getEmailFromUuid(uuid);
                if (email.equals("test")) {
                    UUID newUuid = getUuidFromEmail("test");
                    if (getEmailFromUuid(newUuid).equals("test")) {
                        addOrReplace(uuid, "test2");
                        if (getEmailFromUuid(uuid).equals("test2")) {
                            delete(uuid);
                            if (getEmailFromUuid(uuid) == null) {
                                addOrReplace(uuid, "test");
                                delete("test");
                                if (getEmailFromUuid(uuid) == null) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
