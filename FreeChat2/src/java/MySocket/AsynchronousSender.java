/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MySocket.ISend;
import FreeChat2.Global;
import MyWeb.GuarbageWatch;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import javax.websocket.Session;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class AsynchronousSender {

    private Enums.Type type;
    private String name;
    private IAsynchronousSender iAsynchronousSender;

    public AsynchronousSender(IAsynchronousSender iAsynchronousSender, String name, Enums.Type type) {
        GuarbageWatch.add(this);
        this.type = type;
        this.name = name;
        this.iAsynchronousSender = iAsynchronousSender;
    }

    public void send(JSONObject jObject) {
            iAsynchronousSender.send(jObject, name);
    }

    public void send(List<JSONObject> jObjects) {
            iAsynchronousSender.send(jObjects, name);
    }
}
