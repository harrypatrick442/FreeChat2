/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import Database.UUID;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author EngineeringStudent
 */
public class AsynchronousSenders implements IGetAsynchronousSenders {

    private static AsynchronousSenders instance = new AsynchronousSenders();
    private Map<UUID, HashMap<String, AsynchronousSendersSet>> map = new HashMap<UUID, HashMap<String,AsynchronousSendersSet>>();

    public static AsynchronousSenders getInstance() {
        return instance;
    }

    @Override
    public AsynchronousSendersSet getAsynchronousSenders(UUID uuid, String endpoint) {
        
        HashMap<String, AsynchronousSendersSet> m = map.get(uuid);
        if (m != null) {
            return m.get(endpoint);
        }
        System.out.println("get: ");
        System.out.println(uuid);
        new NullPointerException("returned as null").printStackTrace(System.out);
        printMap();
        return null;
    }
    private void printMap(){
        System.out.println("map: ");
    for(UUID uuid : map.keySet())
    {
        HashMap<String, AsynchronousSendersSet> hashMap = map.get(uuid);
        for(String name : hashMap.keySet())
        {
            System.out.println("user uuid: "+uuid+", name: "+name+";");
        }
    }
    }
    public AsynchronousSendersSet add(AsynchronousSender asynchronousSender, UUID uuid) {
        
        System.out.println("add: ");
        System.out.println(uuid);
        HashMap<String, AsynchronousSendersSet> m = map.get(uuid);
        String name = asynchronousSender.getName();
        AsynchronousSendersSet s;
        if (m == null) {
            m = new HashMap<String, AsynchronousSendersSet>();
            map.put(uuid, m);
            s = new AsynchronousSendersSet(asynchronousSender);
            m.put(name, s);
        }
        else
        {
            s = m.get(name);
            if(s==null){
                s = new AsynchronousSendersSet(asynchronousSender);
                m.put(name, s);
            }
            else
            {
                if(!s.contains(asynchronousSender))
                    s.add(asynchronousSender);
            }
        }
        return s;
    }
    public void remove(AsynchronousSender asynchronousSender, UUID uuid) {
        
        System.out.println("called remove on AsynchronousSenders with user id: "+uuid.toString()+" with hash : "+this.hashCode());
        System.out.println(uuid);
        HashMap<String, AsynchronousSendersSet> m = map.get(uuid);
        String name = asynchronousSender.getName();
        AsynchronousSendersSet s;
        if (m != null) {
        {
            s = m.get(name);
            if(s!=null){
			System.out.println("");
                s.remove(asynchronousSender);
				if(s.size()<1)
					m.remove(name);
            }
        }
    }
	}
}
