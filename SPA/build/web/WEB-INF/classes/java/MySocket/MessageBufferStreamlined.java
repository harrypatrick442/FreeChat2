/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.GuarbageWatch;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;
import MyWeb.MyConsole;

/**
 *
 * @author SoftwareEngineer7
 */
public class MessageBufferStreamlined implements ISend {

    private List<JSONObject> toSend = new ArrayList<JSONObject>();
    public volatile Boolean isWaiting = false;

    public MessageBufferStreamlined() {
            GuarbageWatch.add(this);
    }

    public List<JSONObject> getMessages(int nMax) {
        synchronized (toSend) {
            int length = toSend.size();
         MyConsole.out.println("length is: ");
         MyConsole.out.println(length);
            int i = 0;
            int j = length <= nMax ? length : nMax;
            List<JSONObject> returns = new ArrayList<JSONObject>();
            while (i < j) {
                returns.add(toSend.remove(0));
                i++;
            }
            if (length <= nMax) {
                isWaiting = false;
            }
            return returns;
        }
    }

    public List<JSONObject> getMessages() {
        synchronized (toSend) {
            List<JSONObject> returns = new ArrayList<JSONObject>();
            returns.addAll(toSend);
            toSend.clear();
            isWaiting = false;
            return returns;
        }
    }

    @Override
    public void send(JSONObject jObject) {
        if (jObject != null) {
            MyConsole.out.println("sent");
            synchronized (toSend) {
                toSend.add(jObject);
                isWaiting = true;
            }
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        if (jObjects != null) {
            synchronized (toSend) {
            MyConsole.out.println("sent"+jObjects.size());
                toSend.addAll(jObjects);
                if (jObjects.size() > 0) {
                    isWaiting = true;
                }
            }
        }
    }

}
