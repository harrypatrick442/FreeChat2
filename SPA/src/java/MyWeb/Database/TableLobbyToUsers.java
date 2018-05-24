/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.ILobbyToUsers;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import FreeChat2.User;
import MyWeb.Tuple;
import java.util.ArrayList;
/**
 *
 * @author EngineeringStudent
 */
public class TableLobbyToUsers extends Table implements ILobbyToUsers {

    public TableLobbyToUsers(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        
        String[] strs = {"CREATE TABLE IF NOT EXISTS `lobby_users`"
            + "("         
            + "`userUuid` BINARY(16) NOT NULL,"
            + "`joined` BIGINT(20) NOT NULL, "
            + "`endpoint` TEXT NOT NULL, "
            + "PRIMARY KEY (`userUuid`),"
            + "INDEX `indexJoined` (`joined`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `lobby_users_get`; ",
            "CREATE PROCEDURE `lobby_users_get`("
            + ")"
            + "BEGIN "
            + "SELECT HEX(userUuid), endpoint FROM lobby_users;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `lobby_users_count`; ",
            "CREATE PROCEDURE `lobby_users_count`("
            + ")"
            + "BEGIN "
            + "SELECT COUNT(*) FROM lobby_users;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `lobby_users_add`; ",
            "CREATE PROCEDURE `lobby_users_add` ("
            + "IN userUuidIn VARCHAR(32),"
            + "IN joined BIGINT(20),"
                + "IN endpointIn TEXT"
            +") "
            +"INSERT INTO lobby_users(userUuid, joined, endpoint) VALUES(UNHEX(userUuidIn), joined, endpointIn) ON DUPLICATE KEY UPDATE userUuid = UNHEX(userUuidIn), endpoint = endpointIn;",
            "DROP PROCEDURE IF EXISTS `lobby_users_remove`; ",
            "CREATE PROCEDURE `lobby_users_remove`("
            + "IN userUuid VARCHAR(32),"
            + "IN `left` BIGINT(20)"
            + ")"
            + "BEGIN "
            + "INSERT INTO lobby_users_history(roomUuid, userUuid, joined, `left`) "
            + "VALUES( UNHEX(roomUuid), UNHEX(userUuid), (SELECT joined FROM lobby_users_history WHERE roomUuid = UNHEX(roomUuid) AND userUuid = UNHEX(userUuid)), `left`);"
            + "DELETE FROM lobby_users WHERE userUuid = UNHEX(userUuid);"
            + "END;"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs) {
                System.out.println(str);
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
    public ArrayList<Tuple<User, String>> get() throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        ArrayList<Tuple<User, String>> returns = new ArrayList<Tuple<User, String>>();
            try {
            conn = getConnection();
            String str = "CALL `lobby_users_get`();";
            st = conn.prepareCall(str);
            ResultSet rS = st.executeQuery();
            while (rS.next()) {
                returns.add(new Tuple<User, String>(
                        new User(new UUID(rS.getString(1))), 
                        rS.getString(2))
                        );
            }
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
        return returns;
    }

    @Override
    public void add(UUID userUuid, String endpoint) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `lobby_users_add`(?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            st.setLong(2, System.currentTimeMillis());
            st.setString(3, endpoint);
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
    public void remove(UUID userUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `lobby_users_remove`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            st.setLong(2, System.currentTimeMillis());
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
    public Boolean test() throws Exception {
        return true;
    }

    @Override
    public String getEndpoint(UUID userUuid) throws Exception{
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `lobby_users_get_endpoint`(?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            ResultSet rS= st.executeQuery();
            if(rS!=null)
                return rS.getString("endpoint");
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
        return null;
    }

    @Override
    public int getNUsers() throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `lobby_users_count`();";
            st = conn.prepareCall(str);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
               return rS.getInt(1);
            }
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
        throw new Exception("counting Failed");
    }
}



