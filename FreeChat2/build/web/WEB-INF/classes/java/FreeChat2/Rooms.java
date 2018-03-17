/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.Configuration;
import MyWeb.Random;
import MyWeb.Tuple;
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
public class Rooms {

    private static HashMap<String, Room> mapIdToRoom = new HashMap<String, Room>();
    private static HashMap<String, Room> mapNameToRoom = new HashMap<String, Room>();
    public static Set<Room> openOnEnter = new HashSet<Room>();
    private static Set<Room> publicRooms = new HashSet<Room>();
    static {
        for(String key : Configuration.defaultRooms.keySet())
        {
            String id = getUniqueId();
            Tuple<Room.Type, Boolean>tuple= Configuration.defaultRooms.get(key);
            Room room =new Room(id, key, tuple.x);
            Rooms.add(room);
            if(tuple.y)
            {
                openOnEnter.add(room);
            }
        }
    }

    public static String getUniqueId() {
        String randomString = Random.string(16);
        while(mapIdToRoom.keySet().contains(randomString))
        {
            randomString= Random.string(16);
        }
        return randomString;
    }
    public static Set<Room> getSetPublic()
    {
        return new HashSet<Room>(publicRooms);
    }
    public static Room get(String id)
    {
        return mapIdToRoom.get(id);
    }
    public static void add(Room room)
    {
        mapIdToRoom.put(room.id, room);
        mapNameToRoom.put(room.name, room);
        if(room.type.equals(Room.Type.Static)||room.type.equals(Room.Type.Dynamic)||room.type.equals(Room.Type.VideoStatic)||room.type.equals(Room.Type.VideoDynamic))
        {
            publicRooms.add(room);
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
    public static void remove(Room room)
    {
        mapIdToRoom.remove(room.id);
        mapNameToRoom.remove(room.name);
        if(room.type.equals(Room.Type.Static)||room.type.equals(Room.Type.Dynamic)||room.type.equals(Room.Type.VideoStatic)||room.type.equals(Room.Type.VideoDynamic))
        {
            publicRooms.remove(room);
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
        Iterator<Room> iterator = getSetPublic().iterator();
        while (iterator.hasNext()) {
            jArray.put(iterator.next().getJSONObject());
        }
        jObject.put("rooms", jArray);
        jObject.put("type", "get_rooms");
        return jObject;
    }
    public static String isValidName(String name)
    {
        if(name != null)
        {
            if(name.length()>0&&name.length()<21)
            {
                if(!mapNameToRoom.keySet().contains(name))
                {
                    return null;
                }
                    return "A room with the entered name already exists!";
            }
            return "The name length must be between 1 and 20 characters in length!";
        }
        return "No name was sent";
    }
}
