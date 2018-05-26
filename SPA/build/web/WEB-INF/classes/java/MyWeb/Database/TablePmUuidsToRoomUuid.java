/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IPmUuidsToRoomUuid;
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
public class TablePmUuidsToRoomUuid extends Table implements IPmUuidsToRoomUuid {

    public TablePmUuidsToRoomUuid(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {"CREATE TABLE IF NOT EXISTS `pm_uuids_to_room_uuid`"
            + "("
            + "`roomUuid` BINARY(16) NOT NULL,"            
            + "`userUuid1` BINARY(16) NOT NULL,"            
            + "`userUuid2` BINARY(16) NOT NULL,"
            + "PRIMARY KEY (`roomUuid`),"
            + "INDEX `indexUserUuid1` (`userUuid1`),"
            + "INDEX `indexUserUuid2` (`userUuid2`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `pm_uuids_to_room_uuid_get_room_uuid`; ",
            "CREATE PROCEDURE `pm_uuids_to_room_uuid_get_room_uuid`("
            + "IN userUuid1In VARCHAR(32),"
            + "IN userUuid2In VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT HEX(roomUuid) FROM pm_uuids_to_room_uuid WHERE ((userUuid1=UNHEX(userUuid1In) AND userUuid2=UNHEX(userUuid2In)) OR (userUuid1=UNHEX(userUuid2In) AND userUuid2=UNHEX(userUuid1In)));"
            + " END;",
            "DROP PROCEDURE IF EXISTS `pm_uuids_to_room_uuid_get_other_user`; ",
            "CREATE PROCEDURE `pm_uuids_to_room_uuid_get_other_user`("
            + "IN userUuidIn VARCHAR(32),"
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT HEX(IF(userUuid1 = UNHEX(userUuidIn), userUuid2, userUuid1)) FROM pm_uuids_to_room_uuid WHERE (userUuid1=UNHEX(userUuidIn) OR userUuid2=UNHEX(userUuidIn)) AND roomUuid = UNHEX   (roomUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `pm_uuids_to_room_uuid_contains_room_uuid`; ",
            "CREATE PROCEDURE `pm_uuids_to_room_uuid_contains_room_uuid` ("
            + "IN roomUuid VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT COUNT(*) FROM pm_uuids_to_room_uuid WHERE roomUuid=UNHEX(roomUuid);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `pm_uuids_to_room_uuid_get_user_uuids`; ",
            "CREATE PROCEDURE `pm_uuids_to_room_uuid_get_user_uuids` ("
            + "IN roomUuid VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from pm_uuids_to_room_uuid where roomUuid=UNHEX(roomUuid);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `pm_uuids_to_room_uuid_add`; ",
            "CREATE PROCEDURE `pm_uuids_to_room_uuid_add` ("
            + "IN roomUuid VARCHAR(32),"
            + " IN userUuid1 VARCHAR(32),"
            + "IN userUuid2 VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "INSERT INTO pm_uuids_to_room_uuid(roomUuid, userUuid1, userUuid2) VALUES(UNHEX(roomUuid), UNHEX(userUuid1), UNHEX(userUuid2));"
            +"END;"};
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
    public UUID getRoomUuid(UUID userUuid1, UUID userUuid2) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `pm_uuids_to_room_uuid_get_room_uuid`(?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid1.toString());
            st.setString(2, userUuid2.toString());
            ResultSet rS = st.executeQuery();
            System.out.println("done");
            
            if (rS.next()) {
                System.out.println("returned it");
                return new UUID(rS.getString(1));
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
        return null;
    }

    @Override
    public Tuple<UUID, UUID> getUserUuids(UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `pm_uuids_to_room_uuid_get_user_uuids`(?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return new Tuple<UUID, UUID>(new UUID(rS.getString("userUuid1")), new UUID(rS.getString("userUuid2")));
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
        return null;
    }
    @Override
    public Boolean containsRoomUuid(UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `pm_uuids_to_room_uuid_contains_room_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
               int count = rS.getInt(1);
               return count>=0;
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
        return true;
    }
    @Override
    public void add(UUID roomUuid, UUID userUuid1, UUID userUuid2) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `pm_uuids_to_room_uuid_add`(?, ?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, roomUuid.toString());
            st.setString(2, userUuid1.toString());
            st.setString(3, userUuid2.toString());
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
    public UUID getOtherUser(UUID userUuid, UUID roomUuid) throws Exception {Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `pm_uuids_to_room_uuid_get_other_user`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            st.setString(2, roomUuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return new UUID(rS.getString(1));
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
        return null;
    }

    @Override
    public Boolean test() throws Exception {
        return true;
    }
}



