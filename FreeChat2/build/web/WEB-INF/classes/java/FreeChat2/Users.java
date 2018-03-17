/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.GuarbageWatch;
import MyWeb.Random;
import MyWeb.StopWatch;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Users {

    private static HashSet<WeakReference<User>> list = new HashSet<WeakReference<User>>();
    private static LinkedHashMap<String, WeakReference<User>> fromId = new LinkedHashMap<String, WeakReference<User>>();
    private static Map<String, WeakReference<User>> names = new HashMap<String, WeakReference<User>>();
    private static RunnableCleanup runnableCleanup;

    static {
        runnableCleanup = new RunnableCleanup();
    }

    public static void add(User user) {
        list.add(new WeakReference<User>(user));
        fromId.put(user.id, new WeakReference<User>(user));
    }

    public static void addName(User user) {
        names.put(user.name, new WeakReference<User>(user));
    }

    public static void remove(User user) {
        if (user.name != null) {
            names.remove(user.name);
        }
        fromId.remove(user.id);
    }

    public static User userFromId(String id) {
        WeakReference<User> w = fromId.get(id);
        if (w != null&&!w.isEnqueued()) {
                return w.get();
        }
        return null;
    }
    public static User userFromName(String name)
    {
        WeakReference<User> w = names.get(name);
        if(w!=null&&!w.isEnqueued())
        {
            User user = w.get();
            return user;
        }
        return null;
    }
    public static boolean nameInUse(String name) {
        if (name == null) {
            return true;
        }
        return names.keySet().contains(name);
    }

    public static String getUniqueId() {
        String id = Random.string(32);
        while (fromId.keySet().contains(id)) {
            id = Random.string(32);
        }
        return id;
    }

    public static  void sendMessage(JSONObject jObject) {
        String str = jObject.toString();
        Iterator<WeakReference<User>> iterator = list.iterator();
        while (iterator.hasNext()) {

            WeakReference<User> w = iterator.next();
            if (!w.isEnqueued()) {
                try {
                    User user = w.get();
                    if(user!=null&&user.active)
                    {
                        user.send(jObject);
                    }
                } catch (Exception ex) {
            ex.printStackTrace();
                }
            }
        }
    }

    public static JSONArray getJSONArray() {
        JSONArray jArray = new JSONArray();

        Iterator<WeakReference<User>> iterator = list.iterator();
        while (iterator.hasNext()) {
            WeakReference<User> w = iterator.next();
            if (!w.isEnqueued()) {
                User user = w.get();
                try {
                    if(user!=null&&user.active)
                    {
                        JSONObject jObject = user.getJSONObject();
                        if (jObject != null) {
                            jArray.put(jObject);
                        }
                    }
                } catch (JSONException ex) {
            ex.printStackTrace();
                }
            }
        }
        return jArray;
    }

    private static class RunnableCleanup implements Runnable {

        private Thread thread;

        public RunnableCleanup() {
       GuarbageWatch.add(this) ;
            thread = new Thread(this);
        }

        public void run() {
            StopWatch stopWatch = new StopWatch();
            while (Global.run) {
                if (stopWatch.get_ms() > 2000) {
                    stopWatch.Reset();
                    cleanup();
                }
                try {
                    Thread.sleep(10000);
                } catch (InterruptedException ex) {

                }
            }
        }

        private void cleanup() {
            /*HashSet<String> namesCopy = new HashSet<String>(names);
             HashSet<WeakReference<User>> listCopy = new HashSet<WeakReference<User>>(list);
             Iterator<WeakReference<User>> iterator = listCopy.iterator();
             while(iterator.hasNext())
             {
             WeakReference<User> r  = iterator.next();
             if(!r.isEnqueued())
             {
             namesCopy.remove(r.get().name);
             }
             }
             names.removeAll(namesCopy);
             int index=0;
             String[] strs = new String[0];
             String[]keySet = fromId.keySet().toArray(strs);
             while(index<keySet.length)
             {
             WeakReference<User> w = fromId.get(keySet[index]);
             if(w.isEnqueued())
             {
             fromId.remove(keySet[index]);
             }
             else
             {
             index++;
             }
             }
             */
        }
    }
}
