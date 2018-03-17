/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.GuarbageWatch;
import MyWeb.Ip;
import MyWeb.StopWatch;
import MySocket.AsynchronousSender;
import static MyWeb.Ip.fileIpLog;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.io.Serializable;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.WeakHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Wall implements Serializable {
    
    public boolean passwordProtected;
    public String password;
    public String name;
    public String id;
    private TimeoutWall timeout;
    private AdminMessages adminMessages;
    
    public enum Type {
        
        Static, Dynamic
    };
    public Type type;
    private int nHistory = 50;
    public WeakHashMap<User, AsynchronousSender> users = new WeakHashMap<User, AsynchronousSender>();
    private List<JSONObject> history = new ArrayList<JSONObject>();
    
    public Wall(String id, String name, Type type) {
       GuarbageWatch.add(this) ;
        this.name = name;
        this.id = id;
        this.type = type;
        this.passwordProtected = false;
        InitialzieTimeout();
        InitializeConversation();
        InitializeAdminMessages();
    }
    
    public Wall(String id, String name, boolean passwordProtected, String password, Type type) {
        this.name = name;
        this.id = id;
        this.passwordProtected = passwordProtected;
        this.password = password;
        this.type = type;
        InitialzieTimeout();
        InitializeConversation();
        InitializeAdminMessages();
    }
    
    private void InitialzieTimeout() {
        if (type.equals(Type.Dynamic)) {
            timeout = new TimeoutWall();
        }
    }
    private String path;
    
    private void InitializeConversation() {
        try {
            if (type.equals(Type.Static)) {
                path = System.getProperty("user.home") + "/Desktop/wall_" + name + ".txt";
                File file = new File(path);
                if (!file.exists()) {
                    try {
                        file.createNewFile();
                    } catch (IOException ex) {
                        Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                RandomAccessFile randomAccessFile = new RandomAccessFile(file, "r");
                int lines = 0;
                StringBuilder builder = new StringBuilder();
                long length = file.length();
                length--;
                randomAccessFile.seek(length);
                for (long seek = length; seek >= 0; --seek) {
                    randomAccessFile.seek(seek);
                    char c = (char) randomAccessFile.read();
                    builder.append(c);
                    if (c == '\n'||seek==0) {
                        builder = builder.reverse();
                        try {
                            history.add(0, new JSONObject(builder.toString()));
                        } catch (JSONException ex) {
                            ex.printStackTrace();
                        }
                        lines++;
                        builder = null;
                        builder = new StringBuilder();
                        if (lines == nHistory) {
                            break;
                        }
                    }
                    
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    
    private void InitializeAdminMessages()
    {
        adminMessages = new AdminMessages(name);
    }
    
    public AsynchronousSender getAsynchronousSender(User user) {
        return users.get(user);
    }
    
    public void sendMessage(JSONObject jObjectMessage) {
        sendMessage(null, jObjectMessage, false);
    }
    
    public void sendMessage(User userSending, JSONObject jObjectMessage, boolean notMe) {
        Iterator<User> iterator = getUsers().iterator();
        if (notMe) {
            while (iterator.hasNext()) {
                
                User user = iterator.next();
                if (user != userSending) {
                    try {
                        users.get(user).send(jObjectMessage);
                    } catch (Exception ex) {
            ex.printStackTrace();
                    }
                }
            }
        } else {
            while (iterator.hasNext()) {
                
                User user = iterator.next();
                try {
                    users.get(user).send(jObjectMessage);
                } catch (Exception ex) {
            ex.printStackTrace();
                }
            }
        }
    }
    
    public List<JSONObject> getHistory() {
        return new ArrayList<JSONObject>(history);
    }
    
    public void addMessageToHistory(JSONObject jObject) {
        history.add(jObject);
        while (history.size() > nHistory) {
            history.remove(0);
        }
        if (path != null) {
            try {
                Files.write(Paths.get(path), (jObject.toString() + "\r\n").getBytes(), StandardOpenOption.APPEND);
            } catch (IOException ex) {
                Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public int getNUsers() {
        return users.keySet().size();
    }
    
    public void add(User user, AsynchronousSender asynchronousSender) throws Exception {
        users.put(user, asynchronousSender);
    }
    
    public void remove(User user) {
        users.remove(user);
        if (users.keySet().size() < 1 && (type.equals(Type.Dynamic))) {
            Walls.remove(this);
        }
    }
    
    public HashSet<User> getUsers() {
        return new HashSet<User>(Arrays.asList(users.keySet().toArray(new User[0])));
    }
    
    public User getUser(String name) {
        User user = Users.userFromName(name);
        if (user != null) {
            if (users.containsKey(user)) {
                return user;
            }
        }
        return null;
    }
    
    public List<JSONObject> getAdminMessages()
    {
        return adminMessages.get();
    }
    
    public JSONObject getJSONObject() throws JSONException {
        JSONObject jObject = new JSONObject();
        jObject.put("name", name);
        jObject.put("id", id);
        jObject.put("has_password", passwordProtected);
        String typeString = stringFromType(this.type);
        jObject.put("type", typeString);
        return jObject;
    }
    
    public static String stringFromType(Type type) {
        switch (type) {
            case Static:
                return "static";
            default:
                return "dynamic";
        }
    }
    
    public static Type typeFromString(String typeString) {
        if (typeString.equals("static")) {
            return Type.Static;
        } else{
            return Type.Dynamic;
        }
    }
    
    public void sendUsers() throws Exception {
        try {
            JSONObject jObject = new JSONObject();
            jObject.put("type", "users");
            HashSet<User> users = getUsers();
            JSONArray jArrayUsers = new JSONArray();
            Iterator<User> iterator = users.iterator();
            while (iterator.hasNext()) {
                JSONObject jObjectUser = iterator.next().getJSONObject();
                if (jObjectUser != null) {
                    jArrayUsers.put(jObjectUser);
                }
            }
            jObject.put("users", jArrayUsers);
            sendMessage(jObject);
        } catch (Exception ex) {
            throw ex;
        }
    }
    
    class TimeoutWall implements Runnable {
        
        private Thread thread;
        public TimeoutWall() {
            thread = new Thread(this);
            thread.start();
        }
        
        public void run() {
            StopWatch stopWatch = new StopWatch();
            while (Global.run) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ex) {
            ex.printStackTrace();
                }
                if (stopWatch.get_ms() > 60000) {
                    if (getNUsers() < 1) {
                        Walls.remove(Wall.this);
                    }
                    break;
                }
            }
        }
    }
}
