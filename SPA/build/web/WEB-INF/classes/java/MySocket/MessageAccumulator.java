/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import FreeChat2.Global;
import MyWeb.Configuration;
import MyWeb.GuarbageWatch;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer7
 */
public class MessageAccumulator implements ISend {

    private List<JSONObject> toSend = new ArrayList<JSONObject>();
    private CountDownLatch countDownLatchWait = new CountDownLatch(1);
    public volatile Boolean isInWaiting = false;
    public volatile Boolean hasMessages = false;
    public MessageAccumulator()
    {
        
            GuarbageWatch.add(this);
    }
    public JSONObject getResponse(boolean allowWaiting) throws JSONException {
        isInWaiting = true;
        JSONObject jObject = new JSONObject();
        try {
            while (Global.run && allowWaiting && toSend.size() < 1) {
                try {
                    countDownLatchWait = new CountDownLatch(1);
                    countDownLatchWait.await(Configuration.longPollingDelayMax, TimeUnit.MILLISECONDS);
                } catch (InterruptedException ex) {
                    Logger.getLogger(MySocket.class.getName()).log(Level.SEVERE, null, ex);
                }
                break;
            }
            synchronized (toSend) {
                if(toSend.size()<1)
                    return null;
                Iterator<JSONObject> iterator = toSend.iterator();
                JSONArray jArrayMessages = new JSONArray();
                jObject.put("messages", jArrayMessages);
                while (iterator.hasNext()) {
                    JSONObject jObjectMessage = iterator.next();
                    jArrayMessages.put(jObjectMessage);
                }
                toSend.clear();
                isInWaiting = false;
                hasMessages=false;
            }
        } finally {
            isInWaiting = false;
        }
        return jObject;
    }

    @Override
    public void send(JSONObject jObject) {
        synchronized (toSend) {
            hasMessages = true;
            toSend.add(jObject);
            countDownLatchWait.countDown();
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        synchronized (toSend) {
            if (jObjects.size() > 0) {
                hasMessages = true;
                toSend.addAll(jObjects);
                countDownLatchWait.countDown();
            }
        }
    }
}
