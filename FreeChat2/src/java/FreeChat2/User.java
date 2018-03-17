/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.GuarbageWatch;
import MySocket.AsynchronousSender;
import java.io.Serializable;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class User  implements Serializable{

    public AsynchronousSender asynchronousSender;
    public String name;
    public String picture;
    public String id;
    public boolean active=true;
    public HashMap<String, WeakReference<Room>> roomsIn = new HashMap<String, WeakReference<Room>>();
    public HashMap<String, WeakReference<Wall>> wallsIn = new HashMap<String, WeakReference<Wall>>();

    public User(AsynchronousSender asynchronousSender) {
       GuarbageWatch.add(this) ;
        id = Users.getUniqueId();
        this.asynchronousSender = asynchronousSender;
        this.name = name;
    }

    public Set<Room> getRoomsIn() {
        Set<Room> set = new HashSet<Room>();
        Iterator<WeakReference<Room>> iterator = roomsIn.values().iterator();
        while (iterator.hasNext()) {
            WeakReference<Room> w = iterator.next();
            if (!w.isEnqueued()) {
                set.add(w.get());
            }
        }
        return set;
    }
    
    public Set<Wall> getWallsIn() {
        Set<Wall> set = new HashSet<Wall>();
        Iterator<WeakReference<Wall>> iterator = wallsIn.values().iterator();
        while (iterator.hasNext()) {
            WeakReference<Wall> w = iterator.next();
            if (!w.isEnqueued()) {
                set.add(w.get());
            }
        }
        return set;
    }


    public void addRoomIn(String roomId, Room room) {
        roomsIn.put(roomId, new WeakReference<Room>(room));
    }
    
    public void addWallIn(String wallId, Wall wall) {
        wallsIn.put(wallId, new WeakReference<Wall>(wall));
    }


    public Room getRoomIn(String roomId) {
        WeakReference<Room> r = roomsIn.get(roomId);
        if (r != null) {
            if (!r.isEnqueued()) {
                return r.get();
            } else {
                roomsIn.remove(roomId);
            }
        }
        return null;
    }
    
    public Wall getWallIn(String wallId) {
        WeakReference<Wall> r = wallsIn.get(wallId);
        if (r != null) {
            if (!r.isEnqueued()) {
                return r.get();
            } else {
                wallsIn.remove(wallId);
            }
        }
        return null;
    }

    public void send(JSONObject jObject) {
        asynchronousSender.send(jObject);
    }
    protected void finalize() throws Throwable {
        try {
            Users.remove(this);
        } finally {
            super.finalize();
        }
    }

    public void setName(String name) {
        this.name = name;
        Users.addName(this);
    }

    public void sendUsersToAllRooms() {

        Iterator<Room> iterator = getRoomsIn().iterator();
        while (iterator.hasNext()) {
            try {
                iterator.next().sendUsers();
            } catch (Exception ex) {
            ex.printStackTrace();
            }
        }
    }
    
    public void sendUsersToAllWalls() {

        Iterator<Wall> iterator = getWallsIn().iterator();
        while (iterator.hasNext()) {
            try {
                iterator.next().sendUsers();
            } catch (Exception ex) {
            ex.printStackTrace();
            }
        }
    }


    public JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        if (name == null) {
            return null;
        }
        jObject.put("name", name);
        if(picture!=null)
        {
            jObject.put("picture", picture);
        }
        return jObject;
    }

}
