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
import Database.IUuidToImages;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class TableUuidToImages extends Table implements IUuidToImages {

    public TableUuidToImages(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;

        String[] strs = {"CREATE TABLE IF NOT EXISTS `uuid_to_images`"
            + "("
            + "`id`INT AUTO_INCREMENT NOT NULL,"
            + "`userId` BINARY(16) NOT NULL,"
            + "`relativePath` VARCHAR(255),"
            + "`isProfile` BIT(1),"
            + "PRIMARY KEY (`id`),"
            + "INDEX `indexUserId` (`userId`),"
            + "INDEX `indexRelativePath` (`relativePath`),"
            + "INDEX `indexIsProfile` (`isProfile`)"
            + ")", "CREATE TABLE IF NOT EXISTS `uuid_to_images_json`"
            + "("
            + "`userId` BINARY(16) NOT NULL,"
            + "`all`  TEXT,"
            + "`profile`  TEXT,"
            + "`nonProfile`  TEXT,"
            + "PRIMARY KEY (`userId`)"
            + ")",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_get`; ",
            "CREATE PROCEDURE `uuid_to_images_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select * from uuid_to_images WHERE userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_json_get`; ",
            "CREATE PROCEDURE `uuid_to_images_json_get`("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "select `all` from uuid_to_images_json WHERE userId=UNHEX(userIdIn);"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_get_profile`; ",
            "CREATE PROCEDURE `uuid_to_images_get_profile`("
            + "IN userIdIn VARCHAR(32),"
                + "IN n INT(10) UNSIGNED"
            + ")"
            + "BEGIN "
            + "select relativePath from uuid_to_images WHERE userId=UNHEX(userIdIn) AND isProfile=1 LIMIT n;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_add`; ",
            "CREATE PROCEDURE `uuid_to_images_add` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN relativePathIn VARCHAR(255)"
            + ")"
            + "BEGIN "
            + "SET @count = (SELECT COUNT(*) FROM uuid_to_images WHERE userId = UNHEX(userIdIn));"
            + "INSERT INTO uuid_to_images (userId, relativePath, isProfile) VALUES( UNHEX(userIdIn),relativePathIn, IF(@count<1, TRUE, FALSE));"
            + "SELECT @count<1;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_make_profile`; ",
            "CREATE PROCEDURE `uuid_to_images_make_profile` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN relativePathIn VARCHAR(255)"
            + ")"
            + "BEGIN "
            + "SET @unhexedUserId = UNHEX(userIdIn);"
            + "UPDATE uuid_to_images SET isProfile = TRUE WHERE userId = @unhexedUserId AND relativePath = relativePathIn;"
            + "END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_make_not_profile`; ",
            "CREATE PROCEDURE `uuid_to_images_make_not_profile` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN relativePathIn VARCHAR(255)"
            + ")"
            + "BEGIN "
            + "SET @unhexedUserId = UNHEX(userIdIn);"
            + "SET @count = (SELECT COUNT(*) FROM uuid_to_images WHERE userId = @unhexedUserId AND isProfile = TRUE);"
            + "IF(@count>1) THEN "
            + "UPDATE uuid_to_images SET isProfile = FALSE WHERE userId = @unhexedUserId AND relativePath = relativePathIn;"
            + " END IF; "
            + "SELECT @count>1;"
            + "END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_json_add`; ",
            "CREATE PROCEDURE `uuid_to_images_json_add` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN allIn TEXT,"
            + "IN profileIn TEXT,"
            + "IN nonProfileIn TEXT"
            + ")"
            + "INSERT INTO uuid_to_images_json(userId, `all`, profile, nonProfile) VALUES(UNHEX(userIdIn),allIn, profileIn, nonProfileIn) ON DUPLICATE KEY UPDATE `all`=allIn, profile=profileIn, nonProfile=nonProfileIn;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_delete`; ",
            "CREATE PROCEDURE `uuid_to_images_delete` ("
            + "IN userIdIn VARCHAR(32),"
            + "IN relativePathIn VARCHAR(255)"
            + ")"
            + "BEGIN "
            + "DELETE FROM uuid_to_images WHERE UNHEX(userIdIn) = userId AND relativePath =relativePathIn;"
            + " END;",
            "DROP PROCEDURE IF EXISTS `uuid_to_images_delete_all`; ",
            "CREATE PROCEDURE `uuid_to_images_delete_all` ("
            + "IN userIdIn VARCHAR(32)"
            + ")"
            + "BEGIN "
            + "DELETE FROM uuid_to_images WHERE UNHEX(userIdIn) =userId;"
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

    private List<Image> get(UUID uuid) throws Exception {

        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_json_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                List<Image> list = new ArrayList<Image>();
                JSONArray jArray = new JSONArray(rS.getString("all"));
                for (int i = 0; i < jArray.length(); i++) {
                    JSONObject jObjectImage = jArray.getJSONObject(i);
                    try {
                        list.add(new Image(jObjectImage));
                    } catch (JSONException ex) {

                    }
                }
                return list;
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

    private void updateJson(UUID uuid, List<Image> images) throws Exception {
        JSONArray jArrayNonProfileImages = new JSONArray();
        JSONArray jArrayProfileImages = new JSONArray();
        JSONArray jArrayAllImages = new JSONArray();
        Connection conn = null;
        CallableStatement st = null;
        try {
            String str;
            conn = getConnection();
            Iterator<Image> iterator = images.iterator();
            while (iterator.hasNext()) {
                Image image = iterator.next();
                JSONObject jObjectImage = new JSONObject();
                jObjectImage.put("relativePath", image.getRelativePath());
                jObjectImage.put("isProfile", image.getIsProfile());
                if (!image.getIsProfile()) {
                    jArrayNonProfileImages.put(jObjectImage);
                } else {
                    jArrayProfileImages.put(jObjectImage);
                }
                jArrayAllImages.put(jObjectImage);
            }
            str = "CALL `uuid_to_images_json_add`(?,?,?,?);";
            st = conn.prepareCall(str);
            st.setString(1, uuid.toString());
            st.setString(2, jArrayAllImages.toString());
            st.setString(3, jArrayProfileImages.toString());
            st.setString(4, jArrayNonProfileImages.toString());
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

    @Override
    public void add(UUID u, String relativePath) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_add`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, relativePath);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                List<Image> list = get(u);
                if (list == null) {
                    list = new ArrayList<Image>();
                }
                list.add(new Image(relativePath, rS.getBoolean(1)));
                updateJson(u, list);
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

    private void makeProfile(UUID u, String relativePath) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_make_profile`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, relativePath);
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
    private boolean makeNotProfile(UUID u, String relativePath) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_make_not_profile`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, relativePath);
            ResultSet rS = st.executeQuery();
            
            if(rS.next()){
                System.out.println("getting boolean");
                System.out.println(rS.getBoolean(1));
            return rS.getBoolean(1);
            }
            return false;
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
    public void setProfile(UUID u, String relativePath, boolean isProfile) throws Exception {
        if(isProfile){
            makeProfile(u, relativePath);
            modifyJson(u, relativePath, ModifyOperation.makeProfile);
        }
        else{
            if(makeNotProfile(u, relativePath))modifyJson(u, relativePath, ModifyOperation.makeNotProfile);
        }
    }

    @Override
    public List<String> getProfile(UUID u, int n) throws Exception {        
 Connection conn = null;
        CallableStatement st = null;
        List<String> list = new ArrayList<String>();
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_get_profile`(?,?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setInt(2, n);
            ResultSet rS = st.executeQuery();
            while(rS.next()){
                list.add(rS.getString(1));
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

    private enum ModifyOperation {

        left, right, delete, makeProfile, makeNotProfile
    };

    public void shiftLeft(UUID u, String relativePath) throws Exception {
        modifyJson(u, relativePath, ModifyOperation.left);
    }

    ;
    
    public void shiftRight(UUID u, String relativePath) throws Exception {
        modifyJson(u, relativePath, ModifyOperation.right);
    }

    private void modifyJson(UUID u, String relativePath, ModifyOperation operation) throws Exception {
        List<Image> list = get(u);
        Iterator<Image> iterator = list.iterator();
        boolean found = false;
        Image i = null;
        int index = 0;
        while (iterator.hasNext()) {
            i = iterator.next();
            if (i.getRelativePath().equals(relativePath)) {
                if (operation.equals(ModifyOperation.delete) || operation.equals(ModifyOperation.left) || operation.equals(ModifyOperation.right)) {
                    iterator.remove();
                }
                found = true;
                break;
            }
            index++;
        }
        if (found) {
            if (operation.equals(ModifyOperation.makeProfile)) {
                i.setIsProfile(true);
            } else {
                if (operation.equals(ModifyOperation.makeNotProfile)) {
                    i.setIsProfile(false);
                } else {

                    if (operation.equals(ModifyOperation.left)) {
                        if (index > 0) {
                            index--;
                        }
                        list.add(index, i);
                    } else {
                        if (operation.equals(ModifyOperation.right)) {
                            if (index < list.size() - 1) {
                                index++;
                            }
                            list.add(index, i);
                        }

                    }
                }
            }
        }
        updateJson(u, list);
    }

    public void delete(UUID u, String relativePath) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `uuid_to_images_delete`(?, ?);";
            st = conn.prepareCall(str);
            st.setString(1, u.toString());
            st.setString(2, relativePath);
            st.executeQuery();
            //updateJson(u);
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
        modifyJson(u, relativePath, ModifyOperation.delete);
    }

    private class Image {

        private String relativePath;
        private boolean isProfile = false;

        public Image(ResultSet rS) throws SQLException {
            relativePath = rS.getString("relativePath");
            try {
                isProfile = rS.getBoolean("isProfile");
            } catch (java.sql.SQLException ex) {

            }
        }

        public Image(String relativePath, boolean isProfile) {
            this.relativePath = relativePath;
            this.isProfile = isProfile;
            
        }

        public Image(JSONObject jObject) throws JSONException {
            relativePath = jObject.getString("relativePath");
            try {
                isProfile = jObject.getBoolean("isProfile");
            } catch (JSONException ex) {

            }
        }

        public String getRelativePath() {
            return relativePath;
        }

        public boolean getIsProfile() {
            return isProfile;
        }

        public void setIsProfile(boolean isProfile) {
            this.isProfile = isProfile;
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
