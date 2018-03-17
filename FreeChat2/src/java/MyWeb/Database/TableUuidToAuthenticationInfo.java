/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.AuthenticationInfo;
import Database.IConnectionsPool;
import Database.IUuidToAuthenticationInfo;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToAuthenticationInfo extends Table implements IUuidToAuthenticationInfo {

    public TableUuidToAuthenticationInfo(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_authentication_info`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`hash` VARCHAR(60),"
            + "`salt` VARCHAR(40),"
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexUserId` (`userId`),"
            + "INDEX `indexHash` (`hash`),"
            + "INDEX `indexSalt` (`salt`)"
            + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_authentication_info_get_authentication_info_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_authentication_info_get_authentication_info_from_uuid`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_authentication_info where userId=UNHEX(userIdIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_authentication_info_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_authentication_info_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN hashIn VARCHAR(60),"
            + "IN saltIn VARCHAR(40)"
            + ")INSERT INTO uuid_to_authentication_info(userId, hash, salt) VALUES(UNHEX(userIdIn),hashIn,saltIn)ON DUPLICATE KEY UPDATE hash=hashIn,salt=saltIn;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_authentication_info_delete`; ",
            "CREATE PROCEDURE `uuid_to_authentication_info_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_authentication_info WHERE userId =UNHEX(userIdIn);"};
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
    public AuthenticationInfo getAuthenticationInfoFromUuid(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_authentication_info_get_authentication_info_from_uuid`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.getShortVersion());
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
    public void addOrReplace(UUID u, AuthenticationInfo aI) throws Exception {

        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `uuid_to_authentication_info_add_or_replace`(?, ?, ?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
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
            String str = "{CALL `uuid_to_authentication_info_delete`(?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
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
            if (getAuthenticationInfoFromUuid(uuid) != null) {
                delete(uuid);
            }
            String salt = BCrypt.gensalt(12);
            String hash = BCrypt.hashpw("Fsdffdsdsf_fdsdf", salt);
            AuthenticationInfo aI = new AuthenticationInfo(hash, salt);
            addOrReplace(uuid, aI);
            AuthenticationInfo aiNew = getAuthenticationInfoFromUuid(uuid);
            if (aiNew.getHash().equals(aI.getHash())) {
                if (aiNew.getSalt().equals(aI.getSalt())) {
                    delete(uuid);
                    if (getAuthenticationInfoFromUuid(uuid) == null) {
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
