/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import java.util.HashSet;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class AsynchronousSendersSet extends HashSet<AsynchronousSender> implements ISend{
    public static AsynchronousSendersSet Empty = new AsynchronousSendersSet();
    public AsynchronousSendersSet(AsynchronousSender asynchronousSender){
        this.add(asynchronousSender);
    }
    private AsynchronousSendersSet(){}
    public void send(JSONObject jObject){
        for(AsynchronousSender b :this)
        {
            b.send(jObject);
        }
    }
    public void send(List<JSONObject> jObjects)
    {
        for(AsynchronousSender a : this)
            a.send(jObjects);
    }
}
