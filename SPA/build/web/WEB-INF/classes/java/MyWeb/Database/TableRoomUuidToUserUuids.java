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
import Database.IRoomUuidToMessages;
import MyWeb.Tuple;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public class TableRoomUuidToUserUuids extends Table implements IRoomUuidToUserUuids {

    public TableRoomUuidToUserUuids(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `room_uuid_to_user_uuids`"
            + "("
            + "`id` INT NOT NULL AUTO_INCREMENT,"
            + "`roomUuid` BINARY(16) NOT NULL,"            
            + "`userUuid` BINARY(16) NOT NULL,"
            + "`joined` BIGINT(20), "
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexRoomUuid` (`roomUuid`),"
            + "INDEX `indexUserUuid` (`userUuid`),"
            + "INDEX `indexJoined` (`joined`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_user_uuids_get`; ",
            "CREATE PROCEDURE `room_uuid_to_user_uuids_get`("
            + "IN roomUuid BINARY(16)"
            + ")"
            + "BEGIN "
            + "select HEX(user) from room_uuid_to_use_uuids where roomUuid=UNHEX(roomUuid);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_user_uuids_add`; ",
            "CREATE PROCEDURE `room_uuid_to_user_uuids_add` ("
            + "IN roomUuid BINARY(16),"
            + "IN userUuid BINARY(16),"
            + "IN joined BIGINT(20)"
            + ")IF NOT EXISTS (SELECT * FROM room_uuid_to_user_uuids WHERE roomUuid = UNHEX(roomUuid) AND userUuid = UNHEX(userUuid))" +
            "INSERT INTO room_uuid_to_user_uuids(roomUuid, userUuid, joined) VALUES(UNHEX(roomUuid), UNHEX(userUuid), joined)",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_user_uuids_remove`; ",
            "CREATE PROCEDURE `room_uuid_to_user_uuids_remove`("
            + "IN roomUuid BINARY(16),"
            + "IN userUuid BINARY(16),"
            + "IN left BIGINT(20)"
            + ")"
            + "BEGIN "
            + "INSERT INTO room_uuid_to_use_uuids_history(roomUuid, userUuid, joined, left) "
            + "VALUES( UNHEX(roomUuid), UNHEX(userUuid), (SELECT joined FROM room_uuid_to_use_uuids WHERE roomUuid =UNHEX(roomUuid) AND userUuid = UNHEX(userUuid)), left);"
            + "DELETE FROM room_uuid_to_use_uuids WHERE roomUuid=UNHEX(roomUuid) AND userUuid = UNHEX(userUuid);"
            + "END;"};
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
    public Set<User> get(UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        List<Tuple<String, Long>> returns = new ArrayList<Tuple<String, Long>>();
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_user_uuids_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setLong(2, fromTimestamp);
            st.setLong(3, toTimestamp);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                returns.add(new User(rS.getString("userUuid")));
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
    public void add(UUID roomUuid, UUID userUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_user_uuids_add`(?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid.toString());
            st.setString(3, System.currentTimeMillis());
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
            String str = "CALL `room_uuid_to_user_uuids_remove`(?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid.toString());
            st.setString(3, System.currentTimeMillis());
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
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}



