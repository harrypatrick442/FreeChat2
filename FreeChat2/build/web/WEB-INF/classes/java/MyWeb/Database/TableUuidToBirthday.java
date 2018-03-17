/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUuidToBirthday;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToUsername;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZonedDateTime;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToBirthday extends Table implements IUuidToBirthday {

    public TableUuidToBirthday(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        
        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_birthday`"
                + "("
                + "`userId` BINARY(16) NOT NULL,"
                + "`millis` BIGINT(20) NOT NULL,"
                + "PRIMARY KEY (`userId`),"
                + "INDEX `indexMillis` (`millis`)"
                + ")",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_birthday_get`; ",
            "CREATE PROCEDURE `uuid_to_birthday_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_birthday where userId=UNHEX(userIdIn);"
            + " END;",
            
            "DROP PROCEDURE IF EXISTS `uuid_to_birthday_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_birthday_add_or_replace` ("
            + " IN userIdIn VARCHAR(32),"
                + "IN millisIn BIGINT(20)"
            + ")INSERT INTO uuid_to_birthday(userId, millis) VALUES(UNHEX(userIdIn), millisIn)ON DUPLICATE KEY UPDATE millis=millisIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_birthday_delete`; ",
            "CREATE PROCEDURE `uuid_to_birthday_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_birthday WHERE userId =UNHEX(userIdIn);"
         };
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
    public void addOrReplace(UUID u, long millis) throws Exception 
    {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_birthday_add_or_replace`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.getShortVersion());
            st.setLong(2, millis);
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
            String str = "CALL `uuid_to_birthday_deletez`(?);";
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
        try {
            
            return true;
            
            
            
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
