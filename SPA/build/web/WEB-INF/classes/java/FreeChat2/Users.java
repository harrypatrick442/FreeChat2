/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.ILobbyToUsers;
import Database.UUID;
import MySocket.AsynchronousSender;
import MySocket.IGetAsynchronousSender;
import static MyWeb.Configuration.AuthenticationType.username;
import MyWeb.Tuple;
import Profiles.IDatabase;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Users {


    public static User validate(UUID session, IDatabase iDatabase) throws Exception{
        System.out.println("session is: ");        
        System.out.println(session);

        System.out.println("from session is: ");
        System.out.println( iDatabase.getUserUuidToSession().get(session));
        return new User(iDatabase.getUserUuidToSession().get(session));
    }
    public static ArrayList<Tuple<User, String>> getAll(IDatabase iDatabase) throws Exception{
        return iDatabase.getLobbyToUsers().get();
    }
    public static JSONArray getAllJSONArray(IDatabase iDatabase) throws Exception{
        JSONArray jArray = new JSONArray();
        for(Tuple<User, String> p : getAll(iDatabase)){
            jArray.put(p.x.getJSONObject(iDatabase));
        }
        return jArray;
    }
    public static void sendMessageToAllOnline(JSONObject jObject, IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender) throws Exception{
        ILobbyToUsers iLobbyToUsers = iDatabase.getLobbyToUsers();
        for(Tuple<User, String> p : iLobbyToUsers.get()){
           AsynchronousSender as = iGetAsynchronousSender.getAsynchronousSender(p.x.id, p.y);
           if(as!=null)
            as.send(jObject);
        }
    }
    public static Boolean nameInUse(String name, IDatabase iDatabase) throws Exception{
        System.out.println("in it");
        System.out.println(iDatabase);System.out.println(iDatabase.getUuidToUsername());
        return iDatabase.getUuidToUsername().exists(name);
    }
}
