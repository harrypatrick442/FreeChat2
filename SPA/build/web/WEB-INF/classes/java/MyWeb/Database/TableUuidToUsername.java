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
import Database.IUuidToUsername;
import MyWeb.Configuration;
import java.sql.CallableStatement;
import java.sql.ResultSet;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToUsername extends Table implements IUuidToUsername {

    public TableUuidToUsername(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        
        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_username`"
                + "("
                + "`userId` BINARY(16) NOT NULL,"
                + "`username` VARCHAR(255),"
                + "PRIMARY KEY (`userId`),"
                + "INDEX `indexUsername` (`username`),"
                + "INDEX `indexUserId` (`userId`)"
                + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_username_get_username_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_username_get_username_from_uuid`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_username where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_username_get_count`; ",
            "CREATE PROCEDURE `uuid_to_username_get_count`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT COUNT(*) FROM uuid_to_username where userId=UNHEX(userIdIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_username_get_uuid_from_username`; ",
            "CREATE PROCEDURE `uuid_to_username_get_uuid_from_username` ("
            + " IN usernameIn VARCHAR(255)"
            + ")select HEX(userId) as userId from uuid_to_username where username=usernameIn;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_username_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_username_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN usernameIn VARCHAR(32)"
            + ")INSERT INTO uuid_to_username(userId, username) VALUES(UNHEX(userIdIn),usernameIn)ON DUPLICATE KEY UPDATE username=usernameIn;"
         
           ,"DROP PROCEDURE IF EXISTS `uuid_to_username_delete_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_username_delete_from_uuid` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_username WHERE userId =UNHEX(userIdIn);"
                
           ,"DROP PROCEDURE IF EXISTS `uuid_to_username_delete_from_username`; ",
            "CREATE PROCEDURE `uuid_to_username_delete_from_username` ("
            + "IN usernameIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_username WHERE username =usernameIn;"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for(String str : strs)
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
    public String getUsernameFromUuid(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_username_get_username_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("username");
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
    public UUID getUuidFromUsername(String username) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_username_get_uuid_from_username`(?);";
            st = conn.prepareCall(str);
            st.setString(1, username);
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
    public void addOrReplace(UUID u, String username) throws Exception 
    {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_username_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, username);
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
            String str = "CALL `uuid_to_username_delete_from_uuid`(?);";
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

    public void delete(String username) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_username_delete_from_username`(?);";
            st = conn.prepareCall(str);
            st.setString(1, username);
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
            if (getUuidFromUsername("test@gmail.com") != null) {
                delete("test@gmail.com");
            }
            if (getUsernameFromUuid(uuid) != null) {
                delete(uuid);
            }

            if (getUuidFromUsername("test@gmail.com") == null) {
                addOrReplace(uuid, "test@gmail.com");
                String username = getUsernameFromUuid(uuid);
                if (username.equals("test@gmail.com")) {
                    UUID newUuid = getUuidFromUsername("test@gmail.com");
                    if (getUsernameFromUuid(newUuid).equals("test@gmail.com")) {
                        addOrReplace(uuid, "test2@gmail.com");
                        if (getUsernameFromUuid(uuid).equals("test2@gmail.com")) {
                            delete(uuid);
                            if (getUsernameFromUuid(uuid) == null) {
                                addOrReplace(uuid, "test@gmail.com");
                                delete("test@gmail.com");
                                if (getUsernameFromUuid(uuid) == null) {
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

    @Override
    public Boolean exists(String name) throws Exception {
        System.out.println("exists");
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_username_get_uuid_from_username`(?);";
        System.out.println("exists1");
            st = conn.prepareCall(str);
        System.out.println("exists2");
            st.setString(1, name);
        System.out.println("exist3");
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
        System.out.println("exists4");
                return rS.getString(1)!=null;
            }
            return false;
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
}
