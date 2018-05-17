/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IUuidToLocation;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import java.sql.ResultSet;
import java.sql.CallableStatement;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToLocation extends Table implements IUuidToLocation {

    public TableUuidToLocation(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {
            "CREATE TABLE IF NOT EXISTS `uuid_to_location`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`formattedAddress` VARCHAR(255), "
            + "`level5` INT(11), "
            + "`level6` INT(11), "
            + "`level7` INT(11), "
            + "`level8` INT(11), "
            + "`level9` INT(11), "
            + "`level10` INT(11), "
            + "`level11` INT(11), "
            + "`level12` INT(11), "
            + "`level13` INT(11), "
            + "`level14` INT(11), "
            + "`level15` BIGINT(20), "
            + "`level16` BIGINT(20), "
            + "`level17` BIGINT(20), "
            + "`level18` BIGINT(20), "
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexLevel5` (`level5`),"
            + "INDEX `indexLevel6` (`level6`),"
            + "INDEX `indexLevel7` (`level7`),"
            + "INDEX `indexLevel8` (`level8`),"
            + "INDEX `indexLevel9` (`level9`),"
            + "INDEX `indexLevel10` (`level10`),"
            + "INDEX `indexLevel11` (`level11`),"
            + "INDEX `indexLevel12` (`level12`),"
            + "INDEX `indexLevel13` (`level13`),"
            + "INDEX `indexLevel14` (`level14`),"
            + "INDEX `indexLevel15` (`level15`),"
            + "INDEX `indexLevel16` (`level16`),"
            + "INDEX `indexLevel17` (`level17`),"
            + "INDEX `indexLevel18` (`level18`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_location_get_formatted_address`; ",
            "CREATE PROCEDURE `uuid_to_location_get_formatted_address`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select formattedAddress from uuid_to_location where userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_location_set`; ",
            "CREATE PROCEDURE `uuid_to_location_set` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN formattedAddressIn VARCHAR(255),"
            + "IN level5In INT(11), "
            + "IN level6In INT(11), "
            + "IN level7In INT(11), "
            + "IN level8In INT(11), "
            + "IN level9In INT(11), "
            + "IN level10In INT(11), "
            + "IN level11In INT(11), "
            + "IN level12In INT(11), "
            + "IN level13In INT(11), "
            + "IN level14In INT(11), "
            + "IN level15In BIGINT(20), "
            + "IN level16In BIGINT(20), "
            + "IN level17In BIGINT(20), "
            + "IN level18In BIGINT(20) "
            + ")INSERT INTO uuid_to_location(userId, formattedAddress, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15, level16, level17, level18 ) VALUES(UNHEX(userIdIn) ,  formattedAddress, level5In, level6In, level7In, level8In, level9In, level10In, level11In, level12In, level13In, level14In, level15In, level16In, level17In, level18In)ON DUPLICATE   KEY UPDATE formattedAddress=formattedAddressIn, level5=level5In, level6=level6In, level7=level7In, level8=level8In, level9=level9In, level10=level10In, level11=level11In, level12=level12In, level13=level13In, level14=level14In, level15=level15In, level16=level16In, level17=level17In, level18=level18In;",
            "DROP PROCEDURE IF EXISTS `uuid_to_location_delete`; ",
            "CREATE PROCEDURE `uuid_to_location_delete` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_location WHERE userId =UNHEX(userIdIn);"};
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
    public String getFormattedAddress(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_location_get_formatted_address`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return rS.getString("formattedAddress");
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
    public void set(UUID u, String formattedAddress, int level5, int level6, int level7, int level8, int level9, int level10, int level11, int level12, int level13, int level14, long level15, long level16, long level17, long level18) throws Exception {

        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `uuid_to_location_set`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, formattedAddress);
            st.setInt(3, level5);
            st.setInt(4, level6);
            st.setInt(5, level7);
            st.setInt(6, level8);
            st.setInt(7, level9);
            st.setInt(8, level10);
            st.setInt(9, level11);
            st.setInt(10, level12);
            st.setInt(11, level13);
            st.setInt(12, level14);
            st.setLong(13, level15);
            st.setLong(14, level16);
            st.setLong(15, level17);
            st.setLong(16, level18);
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
            String str = "{CALL `uuid_to_location_delete`(?)}";
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
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
