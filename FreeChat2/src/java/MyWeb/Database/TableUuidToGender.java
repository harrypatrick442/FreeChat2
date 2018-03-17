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
import Database.IUuidToGender;
import java.sql.CallableStatement;
import java.sql.ResultSet;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToGender extends Table implements IUuidToGender {

    public TableUuidToGender(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        
        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_gender`"
                + "("
                + "`userId` BINARY(16) NOT NULL,"
                + "`gender` INT(11),"
                + "PRIMARY KEY (`userId`),"
                + "INDEX `indexGender` (`gender`)"
                + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_gender_get`; ",
            "CREATE PROCEDURE `uuid_to_gender_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_gender where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_gender_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_gender_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN genderIn INT(11)"
            + ")INSERT INTO uuid_to_gender(userId, gender) VALUES(UNHEX(userIdIn),genderIn)ON DUPLICATE KEY UPDATE gender=genderIn;"
         
           ,"DROP PROCEDURE IF EXISTS `uuid_to_gender_delete`; ",
            "CREATE PROCEDURE `uuid_to_gender_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_gender WHERE userId =UNHEX(userIdIn);"};
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
    public String getGenderFromUuid(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_gender_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.getShortVersion());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("gender");
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

    public void addOrReplace(UUID u, int gender) throws Exception 
    {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_gender_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
            st.setInt(2, gender);
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
            String str = "CALL `uuid_to_gender_delete`(?);";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
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
        try {return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
