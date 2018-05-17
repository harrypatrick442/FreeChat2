/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.GuarbageWatch;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class AsynchronousSender {

    private final String name;
    private final IAsynchronousSender iAsynchronousSender;

    public AsynchronousSender(IAsynchronousSender iAsynchronousSender, String name) {
        GuarbageWatch.add(this);
        this.name = name;
        this.iAsynchronousSender = iAsynchronousSender;
    }

    public void send(JSONObject jObject) {
            iAsynchronousSender.send(jObject, name);
    }

    public void send(List<JSONObject> jObjects) {
            iAsynchronousSender.send(jObjects, name);
    }
    public String getName(){
        return name;
    }
}
