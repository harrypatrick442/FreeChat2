/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.IConnectionsPool;
import Database.IProfiles;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Database.Table;
import Database.UUID;
import MyWeb.Tuple;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.mindrot.jbcrypt.BCrypt;
import MyWeb.MyConsole;

/**
 *
 * @author EngineeringStudent
 */
public class TableProfiles extends Table implements IProfiles {

    private static String sharedSelect = " SELECT u.username"
            + "    , HEX(u.userId) AS userId, a.about, s.status, j.joined, lA.lastActive, l.formattedAddress, iJ.json AS   interests, b.millis AS birthday";
    private static String sharedFrom
            = " FROM uuid_to_username u"
            + "       LEFT JOIN uuid_to_status s"
            + "    on u.userId = s.userId"
            + "       LEFT JOIN uuid_to_about a"
            + "    on u.userId = a.userId"
            + "       LEFT JOIN uuid_to_joined j"
            + "    on u.userId = j.userId"
            + "       LEFT JOIN uuid_to_last_active lA"
            + "    on u.userId = lA.userId"
            + "       LEFT JOIN uuid_to_location l"
            + "    on u.userId = l.userId"
            + "       LEFT JOIN uuid_to_interests_json iJ"
            + "    on u.userId=iJ.userId"
            + "       LEFT JOIN uuid_to_birthday b"
            + "    on u.userId=b.userId";
    private static String displaySelect = ", imJ.profile AS pictures";
    private static String displayFrom
            = "       LEFT JOIN uuid_to_images_json imJ"
            + "    on u.userId=imJ.userId";
    private static String fullSelect = ", imJ.all as pictures";
    private static String fullFrom
            = "       LEFT JOIN uuid_to_images_json imJ"
            + "    on u.userId=imJ.userId";

    public TableProfiles(IConnectionsPool iConnectionsPool) {
        super(iConnectionsPool);
    }

    @Override
    public void createIfNotExists() {
        Connection conn = null;
        Statement st = null;
        String[] strs = {
            "DROP PROCEDURE IF EXISTS `profiles_get`; ",
            "CREATE PROCEDURE `profiles_get`("
            + " IN userIdIn VARCHAR(32)"
            + " )"
            + " BEGIN " + sharedSelect + fullSelect
            + sharedFrom + fullFrom
            + " WHERE u.userId=UNHEX(userIdIn)"
            + " GROUP BY u.userId;"
            + " END;"};/*{
         "DROP PROCEDURE IF EXISTS `get_profile_from_uuid`; ",
         "CREATE PROCEDURE `get_profile_from_uuid`("
         + " IN userIdIn VARCHAR(32)"
         + " )"
         + " BEGIN "
         + " SELECT Status FROM uuid_to_Status WHERE userId=UNHEX(userIdIn)"
         + " UNION ALL"
         + " SELECT about FROM uuid_to_about WHERE userId = UNHEX(userIdIn);"
         + " END;"};*/

        try {
            conn = getConnection();
            st = conn.createStatement();
            for (String str : strs) {
                MyConsole.out.println(str);
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
    //where (select count(*) from uuid_to_interests where userid=UNHEX(userIdIn)AND(interestId=A OR interestId = B OR))==nConditions.

    @Override
    public JSONObject get(String userId) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "CALL `profiles_get`(?);";
            st = conn.prepareCall(str);
            st.setString(1, userId);
            ResultSet rS = st.executeQuery();
            if (rS.next()) {
                JSONObject jObjectReply = new JSONObject();
                jObjectReply.put("values", processResultProfile(rS, true));
                return jObjectReply;
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

    public void delete(UUID u) throws Exception {
        Connection conn = null;
        CallableStatement st = null;
        try {
            conn = getConnection();
            String str = "{CALL `uuid_to_last_active_delete`(?)}";
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
            return true;

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    @Override
    public JSONObject get(UUID uuid, JSONObject jObject) throws Exception {
        Connection conn = null;
        PreparedStatement st = null;
        try {
            conn = getConnection();
            StringBuffer sbSelect = new StringBuffer();
            sbSelect.append(sharedSelect);
            sbSelect.append(displaySelect);
            StringBuffer sb = new StringBuffer();
            sb.append(sharedFrom);
            sb.append(displayFrom);
            sb.append(" WHERE u.userId!=UNHEX(?)");
            Iterator<String> iterator = jObject.keys();
            int keyCount = 1;
            int keyCountSelect = 1;
            List<Tuple<Integer, Integer>> parametersIntegersSelect = new ArrayList<Tuple<Integer, Integer>>();
            List<Tuple<Integer, Long>> parametersLongsSelect = new ArrayList<Tuple<Integer, Long>>();
            List<Tuple<Integer, Integer>> parametersIntegers = new ArrayList<Tuple<Integer, Integer>>();
            List<Tuple<Integer, String>> parametersStrings = new ArrayList<Tuple<Integer, String>>();
            List<Tuple<Integer, Long>> parametersLongs = new ArrayList<Tuple<Integer, Long>>();
            parametersStrings.add(new Tuple<Integer, String>(keyCount++, uuid.getShortVersion()));
            while (iterator.hasNext()) {
                //sb.append(" AND");
                String key = iterator.next();
                Object value = jObject.get(key);
                if (key.equals("location")) {
                    JSONArray quads = ((JSONArray) value);
                    int length = quads.length();
                    if (length > 0) {
                        boolean firstLevel = true;
                        sb.append(" AND (");
                        sbSelect.append(",");
                        for (int i = 0; i < length; i++) {
                            JSONObject quad = quads.getJSONObject(i);
                            int keyLevelQuadN = quad.getInt("l");
                            if (firstLevel) {
                                firstLevel = false;
                            } else {
                                sb.append(" OR");
                            }
                            String columnName = " l.level" + keyLevelQuadN;
                            String condition = columnName + "=?";
                            sb.append(condition);
                            sbSelect.append("if(");
                            sbSelect.append(condition);
                            sbSelect.append(",");
                            if (keyLevelQuadN == 15 || keyLevelQuadN == 16 || keyLevelQuadN == 17 || keyLevelQuadN == 18) {
                                long level = quad.getLong("i");
                                parametersLongs.add(new Tuple<Integer, Long>(keyCount++, level));
                                parametersLongsSelect.add(new Tuple<Integer, Long>(keyCountSelect++, level));
                                sbSelect.append(level);
                            } else {
                                int level = quad.getInt("i");
                                parametersIntegers.add(new Tuple<Integer, Integer>(keyCount++, level));
                                parametersIntegersSelect.add(new Tuple<Integer, Integer>(keyCountSelect++, level));
                                sbSelect.append(level);
                            }
                            sbSelect.append(",");
                        }
                        sbSelect.append("NULL");
                        for (int i = 0; i < length; i++) {
                            sbSelect.append(")");
                        }
                        sbSelect.append("AS quadrant");
                        sb.append(")");
                    }
                } else {
                    if (key.equals("interests")) {
                        JSONArray[] interestsArrays = new JSONArray[]{((JSONObject) value).getJSONArray("like"), ((JSONObject) value).getJSONArray("dislike")};
                        boolean isLike = true;
                        for (JSONArray jArray : interestsArrays) {
                            int length = jArray.length();
                            if (length > 0) {
                                if (isLike) {
                                    sb.append(" AND");

                                    sb.append(" ((SELECT COUNT(*) from uuid_to_interests_like WHERE(u.userId=uuid_to_interests_like.userId AND (");

                                } else {
                                    sb.append("AND");
                                    sb.append("((SELECT COUNT(*) from uuid_to_interests_dislike where(u.userId=uuid_to_interests_dislike.userId AND (");
                                }
                                boolean firstInterest = true;
                                for (int i = 0; i < length; i++) {
                                    if (!firstInterest) {
                                        sb.append(" OR");
                                    } else {
                                        firstInterest = false;
                                    }
                                    sb.append(" interestId=?");
                                    parametersIntegers.add(new Tuple<Integer, Integer>(keyCount++, jArray.getInt(i)));
                                }
                                sb.append(")))=");
                                sb.append(length);
                                sb.append(")");
                            }
                            isLike = false;
                        }
                    } else {
                        if (key.equals("age")) {

                        } else {
                            if (key.equals("distance")) {

                            } else {
                                if (key.equals("ethnicities")) {

                                }
                            }
                        }
                    }
                }
            }

            sbSelect.append(sb.toString());
            MyConsole.out.println(sbSelect.toString());

            int offset = parametersLongsSelect.size() + parametersIntegersSelect.size();
            st = conn.prepareStatement(sbSelect.toString());
            for (Tuple<Integer, Integer> pair : parametersIntegersSelect) {
                st.setInt(pair.x, pair.y);
            }
            for (Tuple<Integer, Long> pair : parametersLongsSelect) {
                st.setLong(pair.x, pair.y);
            }
            for (Tuple<Integer, String> pair : parametersStrings) {
                st.setString(pair.x + offset, pair.y);
            }
            for (Tuple<Integer, Integer> pair : parametersIntegers) {
                st.setInt(pair.x + offset, pair.y);
            }
            for (Tuple<Integer, Long> pair : parametersLongs) {
                st.setLong(pair.x + offset, pair.y);
            }
            ResultSet rS = st.executeQuery();
            JSONObject jObjectReply = new JSONObject();
            JSONArray jArrayProfiles = new JSONArray();
            jObjectReply.put("profiles", jArrayProfiles);
            while (rS.next()) {
                //JSONObject jObjectProfile = new JSONObject();
                jArrayProfiles.put(processResultProfile(rS, false));
                //jObjectProfile.put("values", processResultProfile(rS, false));
            }
            return jObjectReply;
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

    private JSONObject processResultProfile(ResultSet rS, boolean full) throws SQLException, JSONException {
        JSONObject jObjectValues = new JSONObject();
        String[] keys = full ? new String[]{"userId", "username", "about", "status", "joined", "lastActive", "formattedAddress", "birthday"}
                : new String[]{"userId", "username", "about", "status", "joined", "lastActive", "formattedAddress", "quadrant", "birthday"};
        for (String key : keys) {
            try {
                Object value = rS.getObject(key);
                if (value != null) {
                    jObjectValues.put(key, value);
                }
            } catch (java.sql.SQLException e) {
            }
        }
        String[] jsonKeys = {"interests"};
        for (String key : jsonKeys) {
            try {
                String value = rS.getString(key);
                if (value != null) {
                    jObjectValues.put(key, new JSONObject(value));
                }
            } catch (java.sql.SQLException e) {
            }
        }
        jsonKeys = new String[]{"pictures"};
        for (String key : jsonKeys) {
            try {
                String value = rS.getString(key);
                if (value != null) {
                    jObjectValues.put(key, new JSONArray(value));
                }
            } catch (java.sql.SQLException e) {
            }
        }
        return jObjectValues;
    }
}
