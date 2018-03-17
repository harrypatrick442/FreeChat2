/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import FreeChat2.Global;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author EngineeringStudent
 */
public class Sessions {

    private static HashMap<String, Session> mapSessions = new HashMap<String, Session>();
    private static Thread threadTimeout = new Thread(new RunnableTimeout());

    static {
        threadTimeout.start();
    }

    public static Session getSession(String id) {
        if (id != null && id != "") {
            synchronized (mapSessions) {
                Session session = mapSessions.get(id);
                if (session != null) {
                    session.wasActive();
                }
                return session;
            }
        }
        return null;
    }

    public static Session getNew() {
        Session session = new Session();
        synchronized (mapSessions) {
            mapSessions.put(session.id, session);
        }
        return session;
    }

    private static String getUniqueId() {
        String randomString = Random.string(16);
        synchronized (mapSessions) {
            while (mapSessions.keySet().contains(randomString)) {
                randomString = Random.string(16);
            }
        }
        return randomString;
    }

    public static class Session {

        public String id;
        public HashMap<String, Object> attributes = new HashMap<String, Object>();
        private StopWatch stopWatch = new StopWatch();

        public long getMsInactive() {
            return stopWatch.get_ms();
        }

        public void wasActive() {
            stopWatch.Reset();
        }

        public Session() {
            GuarbageWatch.add(this);
            id = getUniqueId();
        }

        public void setAttribute(String key, Object value) {
            wasActive();
            synchronized (attributes) {
                attributes.put(key, value);
            }
        }

        public Object getAttribute(String key) {
            wasActive();
            synchronized (attributes) {
                return attributes.get(key);
            }
        }

        public void close() {

            synchronized (attributes) {
                Iterator<Object> i = attributes.values().iterator();
                while (i.hasNext()) {
                    Object value = i.next();
                    if (IClose.class.isAssignableFrom(value.getClass())) {
                        ((IClose) value).close();
                    }
                }
            }
        }

    }

    private static class RunnableTimeout implements Runnable {

        public RunnableTimeout() {
            GuarbageWatch.add(this);
        }

        @Override
        public void run() {
            while (Global.run) {
                try {
                    Thread.sleep(30000);
                } catch (InterruptedException ex) {
                    Logger.getLogger(Sessions.class.getName()).log(Level.SEVERE, null, ex);
                }
                HashMap<String, Session> clone;
                synchronized (mapSessions) {
                    clone = new HashMap<String, Session>(mapSessions);
                }
                Iterator<Session> iterator = clone.values().iterator();
                while (iterator.hasNext()) {
                    Session session = iterator.next();
                    if (session.getMsInactive() > 60000) {
                        session.close();
                        synchronized (mapSessions) {
                            mapSessions.remove(session.id);
                        }
                    }
                }
            }
        }
    }

}
