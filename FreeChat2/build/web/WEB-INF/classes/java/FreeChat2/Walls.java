/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.Configuration;
import MyWeb.Random;
import static FreeChat2.Rooms.getUniqueId;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Walls {

    private static HashMap<String, Wall> mapIdToWall = new HashMap<String, Wall>();
    private static HashMap<String, Wall> mapNameToWall = new HashMap<String, Wall>();
    public static Set<Wall> openOnEnter = new HashSet<Wall>();
    private static Set<Wall> publicWalls = new HashSet<Wall>();
    static {
        for(String key : Configuration.defaultWalls.keySet())
        {
            String id = getUniqueId();
        Walls.add(new Wall( id , key, Configuration.defaultWalls.get(key)));
        }
    }

    public static String getUniqueId() {
        String randomString = Random.string(16);
        while(mapIdToWall.keySet().contains(randomString))
        {
            randomString= Random.string(16);
        }
        return randomString;
    }
    public static Set<Wall> getSetPublic()
    {
        return new HashSet<Wall>(publicWalls);
    }
    public static Wall get(String id)
    {
        return mapIdToWall.get(id);
    }
    public static void add(Wall wall)
    {
        mapIdToWall.put(wall.id, wall);
        mapNameToWall.put(wall.name, wall);
        if(wall.type.equals(Wall.Type.Static)||wall.type.equals(Wall.Type.Dynamic))
        {
            publicWalls.add(wall);
            try
            {
            Users.sendMessage(getJSONObject());
            }
            catch(JSONException ex)
            {
            ex.printStackTrace();
            }
        }
    }
    public static void remove(Wall wall)
    {
        mapIdToWall.remove(wall.id);
        mapNameToWall.remove(wall.name);
        if(wall.type.equals(Wall.Type.Static)||wall.type.equals(Wall.Type.Dynamic))
        {
            publicWalls.remove(wall);
            try
            {
            Users.sendMessage(getJSONObject());
            }
            catch(JSONException ex)
            {
                ex.printStackTrace();
            }
        }
    }

    public static JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        JSONArray jArray = new JSONArray();
        Iterator<Wall> iterator = getSetPublic().iterator();
        while (iterator.hasNext()) {
            jArray.put(iterator.next().getJSONObject());
        }
        jObject.put("walls", jArray);
        jObject.put("type", "get_walls");
        return jObject;
    }
    public static String isValidName(String name)
    {
        if(name != null)
        {
            if(name.length()>0&&name.length()<21)
            {
                if(!mapNameToWall.keySet().contains(name))
                {
                    return null;
                }
                    return "A wall with the entered name already exists!";
            }
            return "The name length must be between 1 and 20 characters in length!";
        }
        return "No name was sent";
    }
}
