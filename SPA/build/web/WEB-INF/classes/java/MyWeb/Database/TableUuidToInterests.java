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
import Database.IUuidToInterests;
import MyWeb.Tuple;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToInterests extends Table implements IUuidToInterests {

    public TableUuidToInterests(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_interests_like`"
            + "("
            + "`id` INT NOT NULL AUTO_INCREMENT,"
            + "`userId` BINARY(16) NOT NULL,"
            + "`interestId` INT NOT NULL,"
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexUserId` (`userId`),"
            + "INDEX `indexInterestId` (`interestId`)"
            + ")", "CREATE TABLE IF NOT EXISTS `uuid_to_interests_dislike`"
            + "("
            + "`id` INT NOT NULL AUTO_INCREMENT,"
            + "`userId` BINARY(16) NOT NULL,"
            + "`interestId` INT NOT NULL,"
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexUserId` (`userId`),"
            + "INDEX `indexInterestId` (`interestId`)"
            + ")", "CREATE TABLE IF NOT EXISTS `uuid_to_interests_json`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`json` TEXT,"
            + "PRIMARY KEY (`userId`),"
            + "INDEX `indexUserId` (`userId`)"
            + ")",
            /*"DROP PROCEDURE IF EXISTS `uuid_to_interests_get`; ",
            "CREATE PROCEDURE `uuid_to_interests_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + " select i.id from  uuid_to_interests u" +
                " on u.interestId = i.id" +
                " LEFT JOIN interests i"
                + "  WHERE  u.userId=UNHEX(userIdIn);"
            + " END;",*/
            "DROP PROCEDURE IF EXISTS `uuid_to_interests_get_json`; ",
            "CREATE PROCEDURE `uuid_to_interests_get_json`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + " select json from  uuid_to_interests_json WHERE  u.userId=UNHEX(userIdIn);"
            + " END;", /*"DROP PROCEDURE IF EXISTS `uuid_to_interests_set`; ",
            "CREATE PROCEDURE `uuid_to_interests_set` ("
            + " IN interestsXml XML"
            + ")"
            + "SELECT"
            + "    I.`Name`,"
            + "    ExtractValue(Xml,'/Xml/Values/Value') AS ListOfValues"
            + "FROM"
            + "    FROM @persons.nodes('/root/Name') as T(C)select HEX(userId) as userId from uuid_to_email where email=emailIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_add_or_replace`; ",
            "CREATE PROCEDURE `uuid_to_email_add_or_replace` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN emailIn VARCHAR(32)"
            + ")INSERT INTO uuid_to_email(userId, email) VALUES(UNHEX(userIdIn),emailIn)ON DUPLICATE KEY UPDATE email=emailIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_delete_from_uuid`; ",
            "CREATE PROCEDURE `uuid_to_email_delete_from_uuid` ("
            + "IN userIdIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_email WHERE userId =UNHEX(userIdIn);",
            "DROP PROCEDURE IF EXISTS `uuid_to_email_delete_from_email`; ",
            "CREATE PROCEDURE `uuid_to_email_delete_from_email` ("
            + "IN emailIn VARCHAR(32)"
            + ")DELETE FROM uuid_to_email WHERE email =emailIn;"*/};
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
    public JSONObject getJsonFromUuid(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_interests_json_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                return new JSONObject(rS.getString("json"));
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
    public void set(UUID u, JSONObject jObject) throws Exception {
        Connection conn = null;
        PreparedStatement st = null;
        try {
            conn = getConnection();
            String uuidString = u.toString();

            st = conn.prepareStatement("DELETE FROM uuid_to_interests_like WHERE userId=UNHEX(?);");
            st.setString(1, uuidString);
            st.executeUpdate();
            st = conn.prepareStatement(" DELETE FROM uuid_to_interests_dislike WHERE userId=UNHEX(?);");
            st.setString(1, uuidString);
            st.executeUpdate();
            st = conn.prepareStatement(" INSERT INTO uuid_to_interests_json (userId, json) VALUES(UNHEX(?),?) ON DUPLICATE KEY UPDATE json=?;");
            st.setString(1, uuidString);
            String strJObject = jObject.toString();
            st.setString(2, strJObject);
            st.setString(3, strJObject);
            st.executeUpdate();
            JSONArray[] jArraysLikeDislike = new JSONArray[]{jObject.getJSONArray("like"), jObject.getJSONArray("dislike")};
            boolean isLike = true;
            for (JSONArray jArraySet : jArraysLikeDislike) {
                int length = jArraySet.length();
                if (length > 0) {
                    if (isLike) {
                        st = conn.prepareStatement("INSERT INTO uuid_to_interests_like (userId, interestId) VALUES(UNHEX(?),?);");

                    } else {
                        st = conn.prepareStatement("INSERT INTO uuid_to_interests_dislike (userId, interestId) VALUES(UNHEX(?),?);");
                    }
                    for (int i = 0; i < length; i++) {
                        st.setString(1, uuidString);
                        st.setInt(2, jArraySet.getInt(i));
                        st.addBatch();
                    }
                    st.executeBatch();
                }
                isLike = false;
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

    @Override
    public void delete(UUID uuid) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "DELETE FROM uuid_to_interests_like WHERE userId=UNHEX(?);DELETE FROM uuid_to_interests_dislike WHERE userId=UNHEX(?);DELETE FROM uuid_to_interests_json WHERE userId=UNHEX(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            st.setString(2, uuid.toString());
            st.setString(3, uuid.toString());
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
        try {
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
/*DELIMITER $$ 
CREATE PROCEDURE profiles_search(IN interestIds VARCHAR(20000))
   BEGIN
   CREATE TEMPORARY TABLE IF NOT EXISTS resultsTable AS (SELECT * FROM table1);
   BEGIN
      DECLARE a INT Default 0 ;
      DECLARE str VARCHAR(255);
	  DECLARE  interId INT;
      simple_loop: LOOP
         SET a=a+1;
         SET str=SPLIT_STR(interests,"|",a);
         IF str='' THEN
            LEAVE simple_loop;
         END IF;
         #Do Inserts into temp table here with str going into the row
         
    SET interId = CONVERT(str,UNSIGNED INTEGER);
         delete r.* from resultsTable r INNER JOIN uuid_to_interests u ON r.userId = u.userId where (select Count(*) from u where interestId = interId)>0;
   END LOOP simple_loop;
   END;
END $$*/
