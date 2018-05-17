/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IInterests;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import Database.IUuidToEmail;
import MyWeb.FoldersHelper;
import MyWeb.JavascriptSetup;
import MyWeb.Tuple;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class TableInterests extends Table implements IInterests {

    public TableInterests(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {
            "DROP TABLE IF EXISTS `interests`; ",
            "CREATE TABLE IF NOT EXISTS `interests`"
            + "("
            + "`id` INT NOT NULL,"
            + "`name` VARCHAR(30),"
            + "PRIMARY KEY (`id`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `interests_get_all`; ",
            "CREATE PROCEDURE `interests_get_all`("
            + ")"
            + "BEGIN "
            + "select * from interests;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `interests_add`; ",
            "CREATE PROCEDURE `interests_add`("
                + "IN idIn INT,"
            + " IN nameIn VARCHAR(30)"
            + ")INSERT INTO interests(id, name) VALUES(idIn, nameIn) ON DUPLICATE KEY UPDATE name=nameIn"};
        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs) {
                st.executeUpdate(str);}
         String interests = JavascriptSetup.getFileContent(FoldersHelper.getFullResourcePath("/javascript/MyWeb/interests.js"));
         interests=interests.substring(interests.indexOf('['), interests.length()-1);
         interests = interests.substring(0, interests.indexOf("]")+1);
         JSONArray jArray = new JSONArray(interests);
         for(int i=0; i<jArray.length(); i++)
         {
             JSONObject jObject =  jArray.getJSONObject(i);
             int value=jObject.getInt("value");
             String txt = jObject.getString("txt");
             add(value, txt);
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
    public List<Tuple<Integer, String>> getAll() throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `interests_get_all`();";
            st = conn.prepareCall(str);
            ResultSet rS = st.executeQuery();
            List<Tuple<Integer, String>> all = new ArrayList<Tuple<Integer, String>>();
            if (rS.next()) {
                all.add(new Tuple<Integer, String>(rS.getInt("id"), rS.getString("name")));
            }
            return all;
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
    public void add(Integer id, String name) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `interests_add`(?, ?);";
            st = conn.prepareCall(str);
            st.setInt(1, id);
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

    public Boolean test() throws Exception {
        try {
            if(getAll().size()>0)
                return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
