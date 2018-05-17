/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.GuarbageWatch;
import MyWeb.Ip;
import MyWeb.StopWatch;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class AdminMessages {

    private StopWatch stopWatch;
    private List<JSONObject> messages = new ArrayList<JSONObject>();
    String path;

    public AdminMessages(String name) {
       GuarbageWatch.add(this) ;
        path = System.getProperty("user.home") + "/Desktop/admin_messages_" + name + ".txt";
    }

    public List<JSONObject> get() {
        if (stopWatch == null || stopWatch.get_ms() > 600000) {
            if (stopWatch == null) {
                stopWatch = new StopWatch();
            } else {
                stopWatch.Reset();
            }
            try {
                File file = new File(path);
                if (!file.exists()) {
                    try {
                        file.createNewFile();
                    } catch (IOException ex) {
                        Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                List<String> lines = Files.readAllLines(Paths.get(path));
                int i = 0;
                messages.clear();
                while (i < lines.size()) {
                    try {
                        String line = lines.get(i);
                        JSONObject jObject;
                        if(line.charAt(0)=='{')
                        {
                            jObject = new JSONObject(line);
                        }
                        else
                        {
                            jObject = new JSONObject();
                            jObject.put("type", "message");
                            jObject.put("name", "Admin");
                            jObject.put("content", line);
                            jObject.put("font", new JSONObject("{\"size\":10,\"color\":\"rgb(78, 0, 0)\",\"underlined\":false,\"bold\":true,\"family\":\"Arial\",\"italic\":false}"));
                        }
                        messages.add(jObject);
                    } catch (JSONException ex) {
                        ex.printStackTrace();
                    }
                    i++;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return new ArrayList<JSONObject>(messages);
    }
}
