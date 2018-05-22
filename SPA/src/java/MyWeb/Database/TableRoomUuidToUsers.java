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
import Database.IRoomUuidToUsers;
import FreeChat2.Room;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import FreeChat2.User;
import MyWeb.Tuple;
import java.util.ArrayList;
/**
 *
 * @author EngineeringStudent
 */
public class TableRoomUuidToUsers extends Table implements IRoomUuidToUsers {

    public TableRoomUuidToUsers(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        
        String[] strs = {"CREATE TABLE IF NOT EXISTS `room_uuid_to_users`"
            + "("
            + "`roomUuid` BINARY(16) NOT NULL,"            
            + "`userUuid` BINARY(16) NOT NULL,"
            + "`joined` BIGINT(20), "
            + "`endpoint` TEXT, "
            + "PRIMARY KEY (`roomUuid`, `userUuid`),"
            + "INDEX `indexJoined` (`joined`)"
            + ")",
            "CREATE TABLE IF NOT EXISTS `room_uuid_to_users_history`"
            + "("
            + "`id` INT NOT NULL AUTO_INCREMENT,"
            + "`roomUuid` BINARY(16) NOT NULL,"            
            + "`userUuid` BINARY(16) NOT NULL,"
            + "`joined` BIGINT(20), "            
            + "`left` BIGINT(20), "
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexRoomUuid` (`roomUuid`),"
            + "INDEX `indexUserUuid` (`userUuid`),"
            + "INDEX `indexJoined` (`joined`),"
            + "INDEX `indexLeft` (`left`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_users_get`; ",
            "CREATE PROCEDURE `room_uuid_to_users_get`("
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select HEX(userUuid), endpoint from room_uuid_to_users where roomUuid=UNHEX(roomUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_users_count`; ",
            "CREATE PROCEDURE `room_uuid_to_users_count`("
            + "IN roomUuid VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT COUNT(*) from room_uuid_to_users where roomUuid=UNHEX(roomUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_users_add`; ",
            "CREATE PROCEDURE `room_uuid_to_users_add` ("
            + "IN roomUuidIn VARCHAR(32),"
            + "IN userUuidIn VARCHAR(32),"
            + "IN `joined` BIGINT(20),"
                + "IN endpointIn TEXT"
            + ")"
            + " INSERT INTO room_uuid_to_users(roomUuid, userUuid, `joined`, endpoint) VALUES(UNHEX(roomUuidIn), UNHEX(userUuidIn), `joined`, endpointIn) ON DUPLICATE KEY UPDATE endpoint=endpointIn;"
                ,
            "DROP PROCEDURE IF EXISTS `room_uuid_to_users_remove`; ",
            "CREATE PROCEDURE `room_uuid_to_users_remove`("
            + "IN roomUuidIn VARCHAR(32),"
            + "IN userUuidIn VARCHAR(32),"
            + "IN leftIn BIGINT(20)"
            + ")"
                + "BEGIN "
            + "INSERT INTO room_uuid_to_users_history(roomUuid, userUuid, `joined`, `left`) "
            + "VALUES( UNHEX(roomUuidIn), UNHEX(userUuidIn), (SELECT `joined` FROM room_uuid_to_users WHERE roomUuid =UNHEX(roomUuidIn) AND userUuid = UNHEX(userUuidIn)), leftIn);"
            + "DELETE FROM room_uuid_to_users WHERE roomUuid=UNHEX(roomUuidIn) AND userUuid = UNHEX(userUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_users_get_n_rooms_most_users`; ",
            "CREATE PROCEDURE `room_uuid_to_users_get_n_rooms_most_users`("
            + "IN nRooms INT(10) UNSIGNED "
            + ")"
            + "BEGIN "
            + "SELECT HEX(roomUuid) FROM room_uuid_to_users GROUP BY roomUuid ORDER BY COUNT(*)DESC LIMIT nRooms;"
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

    @Override
    public ArrayList<Tuple<User, String>> get(UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        ArrayList<Tuple<User, String>> returns = new ArrayList<Tuple<User, String>>();
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_users_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                        System.out.println("the returned string is: "+rS.getString(1));
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
    public void add(UUID roomUuid, UUID userUuid, String endpoint) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            System.out.println("asynchronousSender.getName() is: ");
            System.out.println(endpoint);
            String str = "CALL `room_uuid_to_users_add`(?,?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid.toString());
            st.setLong(3, System.currentTimeMillis());
            st.setString(4, endpoint);
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
    public void remove(UUID roomUuid, UUID userUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_users_remove`(?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid.toString());
            st.setLong(3, System.currentTimeMillis());
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
    public String getEndpoint(UUID roomUuid, UUID userUuid) throws Exception{
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_users_get_endpoint`(?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid.toString());
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
    public int getNUsers(UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_users_count`(?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
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

    @Override
    public ArrayList<UUID> getNRoomsWithMostUsers(int nRooms) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        ArrayList<UUID> returns = new ArrayList<UUID>();
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_users_get_n_rooms_most_users`(?);";
            st = conn.prepareCall(str);
            st.setInt(1, nRooms);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                returns.add(new UUID(rS.getString(1)));
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
}



