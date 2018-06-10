/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IRoomUuidToInfo;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import FreeChat2.RoomInfo;
import FreeChat2.RoomType;
import MyWeb.Configuration;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public class TableRoomUuidToInfo extends Table implements IRoomUuidToInfo {

    public TableRoomUuidToInfo(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `room_uuid_to_info`"
            + "("
            + "`roomUuid` BINARY(16) NOT NULL,"
            + "`createdTimestamp` BIGINT(20) NOT NULL,"
            + "`name` VARCHAR(" + Configuration.ROOM_NAME_LENGTH_MAX + "),"
            + "`hasPassword` TINYINT(1) NOT NULL,"
            + "`type` VARCHAR(20) NOT NULL,"
            + "PRIMARY KEY (`roomUuid`),"
            + "INDEX `indexHasPassword` (`hasPassword`),"
            + "INDEX `indexName` (`name`),"
            + "INDEX `indexType` (`type`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_info_add`; ",
            "CREATE PROCEDURE `room_uuid_to_info_add`("
            + "IN roomUuid VARCHAR(32),"
            + "IN name VARCHAR(" + Configuration.ROOM_NAME_LENGTH_MAX + "),"
            + "IN hasPassword TINYINT(1),"
            + "IN typeIn VARCHAR(20),"
            + "IN createdTimestamp BIGINT(20)"
            + ")"
            + "BEGIN "
            + "INSERT INTO room_uuid_to_info(roomUuid, name, hasPassword, type, createdTimestamp) VALUES(UNHEX(roomUuid), name, hasPassword, typeIn, createdTimestamp);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_info_get`; ",
            "CREATE PROCEDURE `room_uuid_to_info_get`("
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SET @pmUsernames=NULL;"
            + "SELECT name, hasPassword,type INTO @name, @hasPassword, @type FROM room_uuid_to_info WHERE roomUuid = UNHEX(roomUuidIn);"
            + "IF(@type='pm')THEN"
                + " SET @pmUsernames = (SELECT CONCAT('[', GROUP_CONCAT(CONCAT('\\\"',u.username,'\\\"')),']') FROM pm_uuids_to_room_uuid p INNER JOIN uuid_to_username u ON p.userUuid2 = u.userId OR p.userUuid1= u.userId WHERE p.roomUuid = UNHEX(roomUuidIn) GROUP BY p.roomUuid);"
            + " END IF;"//CONCAT('[', GROUP_CONCAT(CONCAT('\"',u.username,'\"')),']') usernames 
            + "SELECT @name, @hasPassword, @type, @pmUsernames;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_info_count`; ",
            "CREATE PROCEDURE `room_uuid_to_info_count`("
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "SELECT COUNT(*) FROM room_uuid_to_info WHERE roomUuid = UNHEX(roomUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_info_set_name`; ",
            "CREATE PROCEDURE `room_uuid_to_info_set_name` ("
            + "IN roomUuid VARCHAR(32),"
            + "IN name VARCHAR(" + Configuration.ROOM_NAME_LENGTH_MAX + ")"
            + ")"
            + "BEGIN "
            + "UPDATE room_uuid_to_info SET name = name WHERE roomUuid=UNHEX(roomUuid);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `room_uuid_to_info_get_n_public`; ",
            "CREATE PROCEDURE `room_uuid_to_info_get_n_public` ("
            + "IN nRooms INT(10) UNSIGNED "
            + ")"
            + "BEGIN "
            + "SELECT HEX(roomUuid) FROM room_uuid_to_info WHERE type != \"pm\" LIMIT nRooms ;"
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

    public RoomInfo get(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            System.out.println(uuid);
            conn = getConnection();
            String str = "CALL `room_uuid_to_info_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                RoomType roomType = RoomType.fromString(rS.getString(3));
                System.out.println(roomType);
                return new RoomInfo(uuid, rS.getString(1), rS.getBoolean(2), roomType, rS.getString(4));
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

    public void setName(UUID uuid, String name) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_info_set_name`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            st.setString(2, name);
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

    public List<UUID> getNPublicRooms(int nRooms) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            List<UUID> list = new ArrayList<UUID>();
            conn = getConnection();
            String str = "CALL `room_uuid_to_info_get_n_public`(?);";
            st = conn.prepareCall(str);
            st.setInt(1, nRooms);
            ResultSet rS = st.executeQuery();
            while (rS.next()) {
                list.add(new UUID(rS.getString(1)));
            }
            return list;
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
    public void add(UUID uuid, String name, String type, Boolean hasPassword) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_info_add`(?,?,?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            st.setString(2, name);
            st.setBoolean(3, hasPassword);
            st.setString(4, type);
            st.setLong(5, System.currentTimeMillis());
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
    public Boolean nameExists(String name) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_info_name_exists`(?);";
            st = conn.prepareCall(str);
            st.setString(1, name);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                int count = rS.getInt(1);
                return count > 0;
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
        return true; //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public UUID getUnusedUuid() throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            while (true) {
                UUID uuid = new UUID();
                System.out.println(uuid);
                String str = "CALL `room_uuid_to_info_count`(?);";
                st = conn.prepareCall(str);
                st.setString(1, uuid.toString());
                ResultSet rS = st.executeQuery();
                if (rS.next()) {
                    
					if(rS.getInt(1)<=0)
						return uuid;
                }
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
    }
}
