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
public class TableRoomUuidToMessages extends Table implements IRoomUuidToMessages {

    public TableRoomUuidToMessages(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `room_uuid_to_messages`"
            + "("
            + "`id` INT NOT NULL AUTO_INCREMENT,"
            + "`roomUuid` BINARY(16) NOT NULL,"            
            + "`fromUuid` BINARY(16) NOT NULL,"
            + "`message` TEXT,"
            + "`timestamp` BIGINT(20), "
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexRoomUuid` (`roomUuid`),"
            + "INDEX `indexFromUuid` (`fromUuid`),"
            + "INDEX `indexTimestamp` (`timestamp`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_messages_get`; ",
            "CREATE PROCEDURE `room_uuid_to_messages_get`("
            + "IN roomUuid BINARY(16),"
            + "IN fromTimestamp BIGINT(20), "
            + "IN toTimestamp BIGINT(20)"
            + ")"
            + "BEGIN "
            + "select * from room_uuid_to_messages where roomUuid=UNHEX(roomUuid) and timestamp >=fromTimestamp and timestamp < toTimestamp;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_messages_get_n_messages`; ",
            "CREATE PROCEDURE `room_uuid_to_messages_get_n_messages`("
            + "IN roomUuid BINARY(16),"
            + "IN nMessages INT(10) UNSIGNED"
            + ")"
            + "BEGIN "
            + "SELECT * FROM room_uuid_to_messages WHERE roomUuid=UNHEX(roomUuid) ORDER BY timestamp DESC LIMIT nMessages;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_messages_add`; ",
            "CREATE PROCEDURE `room_uuid_to_messages_add` ("
            + "IN roomUuid BINARY(16),"
            + "IN fromUuid BINARY(16),"
            + "IN message TEXT,"
            + "IN timestamp BIGINT(20)"
            + ")INSERT INTO room_uuid_to_messages(roomUuid, message, timestamp) VALUES(UNHEX(roomUuid), message, timestamp)",};
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
    public List<Tuple<String, Long>> get(UUID roomUuid, long fromTimestamp, long toTimestamp) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        List<Tuple<String, Long>> returns = new ArrayList<Tuple<String, Long>>();
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_messages_get`(?, ?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setLong(2, fromTimestamp);
            st.setLong(3, toTimestamp);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                returns.add(new Tuple<String, Long>(rS.getString("message"), rS.getLong("timestamp")));
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
    public void add(UUID roomUuid, UUID fromUuid, String message, long timestamp) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_messages_add`(?,?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, fromUuid.toString());
            st.setString(3, message);
            st.setLong(4, timestamp);
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
    public List<String> getNMessages(UUID roomUuid, int nMessages) throws Exception {Connection conn = null;
        CallableStatement st = null;
        List<String> returns = new ArrayList<String>();
            try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_messages_get_n_messages`(?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setInt(2, nMessages);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                returns.add(rS.getString("message"));
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



