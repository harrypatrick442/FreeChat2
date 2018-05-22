/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import Database.UUID;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author EngineeringStudent
 */
public class AsynchronousSenders implements IGetAsynchronousSender {

    private static AsynchronousSenders instance = new AsynchronousSenders();
    private Map<UUID, HashMap<String, AsynchronousSender>> map = new HashMap<UUID, HashMap<String, AsynchronousSender>>();

    public static AsynchronousSenders getInstance() {
        return instance;
    }

    @Override
    public AsynchronousSender getAsynchronousSender(UUID uuid, String endpoint) {
        HashMap<String, AsynchronousSender> m = map.get(uuid);
        if (m != null) {
            return m.get(endpoint);
        }
        new NullPointerException("returned as null").printStackTrace(System.out);
        return null;
    }

    public void add(AsynchronousSender asynchronousSender, UUID uuid) {
        HashMap<String, AsynchronousSender> m = map.get(uuid);
        if (m == null) {
            m = new HashMap<String, AsynchronousSender>();
            map.put(uuid, m);
        }
        m.put(asynchronousSender.getName(), asynchronousSender);
    }
}
