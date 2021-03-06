/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MySocket.IGetAsynchronousSenders;
import MyWeb.Configuration;
import Profiles.AuthenticationHelper;
import Profiles.IDatabase;
import Profiles.Result;
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
public class Rooms {

  
    /*
    static {
        for(String key : Configuration.defaultRooms.keySet())
        {
            in this case look them up by name and create them if they do not exist.
            //UUID id = getUniqueId();
            Tuple<Room.Type, Boolean>tuple= Configuration.defaultRooms.get(key);
            Room room =new Room(id, key, tuple.x);
            Rooms.add(room);
            if(tuple.y)
            {
                openOnEnter.add(room);
            }
        }
    }*/
    public static List<Room> getOpenOnEnter(final IDatabase iDatabase, final IGetAsynchronousSenders iGetAsynchronousSender) throws Exception
    {
        ArrayList<Room> popular = getPopular(iDatabase, iGetAsynchronousSender);
        for(int i=4; i<popular.size(); i++)
            popular.remove(i);
        return popular;
    }
    private static ArrayList<Room> getPopular(IDatabase iDatabase, IGetAsynchronousSenders iGetAsynchronousSenders) throws Exception
    {
        System.out.println("getting popular");
        return PopularRooms.getInstance().get(iDatabase, iGetAsynchronousSenders);
    }
    public static Room get(UUID id, IGetAsynchronousSenders iGetAsynchronousSenders)
    {
        return new Room(id, iGetAsynchronousSenders); //mapIdToRoom.get(id);
    }
    public static Room createNew(String name, RoomType roomType, Boolean passwordProtected, String password, IDatabase iDatabase, IGetAsynchronousSenders iGetAsynchronousSenders) throws RoomCreationException, Exception
    {
        System.out.println("in it");
        isValidName(name, iDatabase);
        System.out.println("was valid name");
        Room room =new Room(iDatabase, iGetAsynchronousSenders);
        System.out.println("got room");
        if(passwordProtected)
        {
        System.out.println("was ");
            Result result = AuthenticationHelper.setPassword(room, password, iDatabase, new Configuration());
            if(result.getSuccess())
            {
                iDatabase.getRoomUuidToInfo().add(room.id, name, roomType.toString(), true);
            }
            else
            {
                throw new RoomCreationException(result.getMessage());
            }
        }
        else
        {
            iDatabase.getRoomUuidToInfo().add(room.id, name, roomType.toString(), false);
        }
        return room;
    }

    public static JSONObject getPopularJSONObject(IDatabase iDatabase, IGetAsynchronousSenders iGetAsynchronousSenders) throws JSONException, Exception {
        JSONObject jObject = new JSONObject();
        JSONArray jArray = new JSONArray();
        Iterator<Room> iterator = getPopular(iDatabase, iGetAsynchronousSenders).iterator();
        while (iterator.hasNext()) {
            jArray.put(iterator.next().getJSONObject(iDatabase));
        }
        jObject.put("rooms", jArray);
        jObject.put("type", "get_rooms");
        return jObject;
    }
    private static String isValidName(String name, IDatabase iDatabase) throws RoomCreationException, Exception
    {
        if(null==name)
            throw new RoomCreationException("No name was sent");
        if(!(name.length()>=Configuration.ROOM_NAME_LENGTH_MIN&&name.length()<Configuration.ROOM_NAME_LENGTH_MAX))
            throw new RoomCreationException("The name length must be between "+Configuration.ROOM_NAME_LENGTH_MIN+" and "+Configuration.ROOM_NAME_LENGTH_MAX+" characters in length!");
        if(iDatabase.getRoomUuidToInfo().nameExists(name))
            throw new RoomCreationException("A room with the entered name already exists!");
        return null;
    }
}
