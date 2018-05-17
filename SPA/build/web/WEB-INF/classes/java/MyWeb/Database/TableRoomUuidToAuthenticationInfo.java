/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.AuthenticationInfo;
import Database.IConnectionsPool;
import Database.IRoomUuidToAuthenticationInfo;
import Database.IRoomUuidToInfo;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import FreeChat2.RoomInfo;
import FreeChat2.RoomType;
import MyWeb.Configuration;
import static java.lang.System.out;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author EngineeringStudent
 */
public class TableRoomUuidToAuthenticationInfo extends Table implements IRoomUuidToAuthenticationInfo {

    public TableRoomUuidToAuthenticationInfo(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `room_uuid_to_authentication_info`"
            + "("
            + "`roomUuid` BINARY(16) NOT NULL,"
            + "`hash` VARCHAR(60),"
            + "`salt` VARCHAR(40),"
            + "PRIMARY KEY (`roomUuid`),"
            + "INDEX `indexHash` (`hash`),"
            + "INDEX `indexSalt` (`salt`)"
            + ")",
            
            "DROP PROCEDURE IF EXISTS `room_uuid_to_authentication_info_get`; ",
            "CREATE PROCEDURE `room_uuid_to_authentication_info_get`("
            + "IN roomUuidIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from room_uuid_to_authentication_info WHERE roomUuid =UNHEX(roomUuidIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `room_uuid_to_authentication_info_add_or_replace`; ",
            "CREATE PROCEDURE `room_uuid_to_authentication_info_add_or_replace` ("
            + "IN roomUuidIn VARCHAR(32),"
            + "IN hashIn VARCHAR(60),"
            + "IN saltIn VARCHAR(40)"
            + ")INSERT INTO room_uuid_to_authentication_info(roomUuid, hash, salt) VALUES(UNHEX(roomUuidIn),hashIn,saltIn)ON DUPLICATE KEY UPDATE hash=hashIn,salt=saltIn;",//, roomUuid = HEX(roomUuidIn);",
            
            "DROP PROCEDURE IF EXISTS `room_uuid_to_authentication_info_delete`; ",
            "CREATE PROCEDURE `room_uuid_to_authentication_info_delete` ("
            + "IN roomUuidIn VARCHAR(32)"
            + ")DELETE FROM room_uuid_to_authentication_info WHERE roomUuid =UNHEX(roomUuidIn);"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs)
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
    public AuthenticationInfo get(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `room_uuid_to_authentication_info_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
              out.println(uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return new AuthenticationInfo(rS.getString(2), rS.getString(3));
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
    public void set(UUID u, AuthenticationInfo aI) throws Exception {

        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `room_uuid_to_authentication_info_add_or_replace`(?, ?, ?)}";
            st = conn.prepareCall(str);
            System.out.println(u.toString());
            st.setString(1, u.toString());
            st.setString(2, aI.getHash());
            st.setString(3, aI.getSalt());
            st.executeUpdate();
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
            String str = "{CALL `room_uuid_to_authentication_info_delete`(?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.executeUpdate();
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
            String salt = BCrypt.gensalt(12);
            String hash = BCrypt.hashpw("Fsdffdsdsf_fdsdf", salt);
            AuthenticationInfo aI = new AuthenticationInfo(hash, salt);
            set(uuid, aI);
            AuthenticationInfo aiNew = get(uuid);
            System.out.println(aiNew);
                        System.out.println(aiNew.getHash());
            if (aiNew.getHash().equals(aI.getHash())) {
                if (aiNew.getSalt().equals(aI.getSalt())) {
                    delete(uuid);
                    if (get(uuid) == null) {
                        return true;
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}



