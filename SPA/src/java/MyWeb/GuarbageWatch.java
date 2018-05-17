/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import static java.lang.System.gc;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 *
 * @author EngineeringStudent
 */
public class GuarbageWatch {

    private static final List<WeakReference<Object>> objects = new ArrayList<WeakReference<Object>>();
    private static Map<String, Integer> mapNameToNSeen = new HashMap<String, Integer>();

    public static void add(Object object) {
        synchronized(objects)
               {
            objects.add(new WeakReference<Object>(object));
            String name = object.getClass().getName();
            if (mapNameToNSeen.keySet().contains(name)) {
                mapNameToNSeen.put(name, mapNameToNSeen.get(name) + 1);
            } else {
                mapNameToNSeen.put(name, 1);
            }
        }
    }

    public static String getSummary() {
        System.gc();
        Map<String, Integer> mapNameToCount = new HashMap<String, Integer>();
        
        StringBuffer sb = new StringBuffer();
        synchronized(objects)
                {
        Iterator<WeakReference<Object>> iterator = objects.iterator();
        while (iterator.hasNext()) {
            Object object = iterator.next().get();
            if (object != null) {
                String name = object.getClass().getName();
                if (mapNameToCount.keySet().contains(name)) {
                    mapNameToCount.put(name, mapNameToCount.get(name) + 1);
                } else {
                    mapNameToCount.put(name, 1);
                }
            } else {
                iterator.remove();
            }
        }
        for (String key : mapNameToNSeen.keySet()) {
            sb.append(key);
            sb.append(":");
            if (mapNameToCount.keySet().contains(key)) {
                sb.append(mapNameToCount.get(key));
            } else {
                sb.append(0);
            }
            sb.append(",");
            sb.append(mapNameToNSeen.get(key));
            sb.append("\r\n");
        }
                }
        return sb.toString();
    }
}
