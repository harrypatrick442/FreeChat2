/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUuidToNotifications;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToUsername;
import Database.Notification;
import MyWeb.Configuration;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToNotifications extends Table implements IUuidToNotifications {

    public TableUuidToNotifications(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_notifications`"
            + "("
            + "`userUuid` BINARY(16) NOT NULL,"
            + "`roomUuid` BINARY(16) NOT NULL,"
            + "`fromUuid` BINARY(16) NOT NULL,"
            + "PRIMARY KEY (`userUuid`, `roomUuid`, `fromUuid`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_notifications_get`; ",
            "CREATE PROCEDURE `uuid_to_notifications_get`("
            + "IN userUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
                
                
            + "SELECT HEX(n.roomUuid), r.name, r.type, CONCAT('[',GROUP_CONCAT(CONCAT('{fromUuid:\"', HEX(n.fromUuid), '\",relativePathImage:\"', (SELECT relativePath FROM uuid_to_images WHERE isProfile = TRUE"
            + " AND n.fromUuid = userId LIMIT 1)"
            + " ,'\",username:\"',(SELECT username FROM uuid_to_username WHERE userId = n.fromUuid),'\"}')),']') users FROM uuid_to_notifications n"
            + " INNER JOIN room_uuid_to_info r"
            + " ON r.roomUuid = n.roomUuid"
            + " WHERE n.userUuid=UNHEX(userUuidIn) GROUP BY n.roomUuid;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_notifications_add`; ",
            "CREATE PROCEDURE `uuid_to_notifications_add`("
            + "IN userUuidIn VARCHAR(32),"
            + "IN fromUuidIn VARCHAR(32),"
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "INSERT INTO uuid_to_notifications (`userUuid`,`roomUuid`,`fromUuid`) VALUES(UNHEX(userUuidIn), UNHEX(roomUuidIn), UNHEX(fromUuidIn)) ON DUPLICATE KEY UPDATE userUuid = UNHEX(userUuidIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_notifications_clear`; ",
            "CREATE PROCEDURE `uuid_to_notifications_clear` ("
            + " IN userUuidIn VARCHAR(32),"
            + "IN roomUuidIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_notifications WHERE userUuid = UNHEX(userUuidIn) AND roomUuid = UNHEX(roomUuidIn);",};
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
    public List<Notification> get(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        List<Notification> list = new ArrayList<Notification>();
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_notifications_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            while (rS.next()) {
                System.out.println("usersadsf"+rS.getString(4));
                list.add(new Notification(new UUID(rS.getString(1)), rS.getString(2), rS.getString(3), rS.getString(4)));
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
    public void add(UUID userUuid, UUID roomUuid, UUID fromUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_notifications_add`(?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            st.setString(2, fromUuid.toString());
            st.setString(3, roomUuid.toString());
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
    public void clear(UUID userUuid, UUID roomUuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_notifications_clear`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, userUuid.toString());
            st.setString(2, roomUuid.toString());
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
        return true;
    }
}
