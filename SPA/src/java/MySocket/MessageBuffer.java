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

/**
 *
 * @author SoftwareEngineer7
 */
public class MessageBuffer implements ISend, IGet {

    private List<JSONObject> toSend = new ArrayList<JSONObject>();
    private ISendUnsynched iSendUnsynched;
    public Boolean isWaiting=false;
    public MessageBuffer(ISendUnsynched iSendUnsynched) {
        this.iSendUnsynched = iSendUnsynched;
            GuarbageWatch.add(this);
    }
    public void getMessages(int nMax) {
        synchronized (toSend) {
            int length = toSend.size();
            int i = 0;
            int j = length <= nMax ? length : nMax;
            while (i < j) {
                iSendUnsynched.sendUnsynched(toSend.remove(0));
                i++;
            }
            if(length<=nMax)
                isWaiting=false;
        }
    }
    public void getMessages() {
        synchronized (toSend) {
                iSendUnsynched.sendUnsynched(toSend);
                toSend.clear();
                isWaiting=false;
        }
    }

    @Override
    public void send(JSONObject jObject) {
        synchronized (toSend) {
            toSend.add(jObject);
            isWaiting=true;
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        synchronized (toSend) {
            toSend.addAll(jObjects);
            if(jObjects.size()>0)
                isWaiting=true;
        }
    }

}
