/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import FreeChat2.Global;
import MyWeb.Configuration;
import MyWeb.GuarbageWatch;
import MyWeb.IClose;
import MyWeb.IGetIp;
import MyWeb.IInterfaces;
import MyWeb.Interpreter;
import MyWeb.Sessions;
import MyWeb.StopWatch;
import MyWeb.MyConsole;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
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
 * @author EngineeringStudent
 */
public class MySocket implements IAsynchronousSender, IGetIp, IInterfaces, IClose {

    private static HashMap<String, IGetInterpreter> mapClassNameToIGetInterpreter = new HashMap<String, IGetInterpreter>();
    private HashMap<String, Interpreter> mapNameToInterpreter = new HashMap<String, Interpreter>();
    private static volatile List<MySocket> instances = new ArrayList<MySocket>();
    public volatile boolean active = true;
    private Sessions.Session session;
    private static Timeout timeout;
    private static IGetInterpreter iGetInterpreter;
    private Enums.Type type;
    private ISend iSend;
    private IGot iGotBefore;
    private ISend iSendBefore;
    private Boolean isPersistent;
    private MessagePersistenceBuffer messagePersistenceBuffer;
    private MessageAccumulator messageAccumulator;
    private MessageBufferStreamlined bufferAccumulatedAjax;

    static {
        timeout = new Timeout();
    }

    public MySocket(ISend iSend, Sessions.Session session, Enums.Type type, Boolean isPersistent) {
        GuarbageWatch.add(this);
        this.iSend = iSend;
        this.type = type;
        this.session = session;
        this.isPersistent = isPersistent;
        if (type.equals(Enums.Type.AJAX)) {
            messageAccumulator = new MessageAccumulator();
        }
        MyConsole.out.println(1);
        if (isPersistent) {

            IGot iGot = new IGot() {
                @Override
                public void got(JSONObject jObject) {
                    try {
                        setsMessages(jObject);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }

                public void got(List<JSONObject> jObjects) {
                    for (JSONObject jObject : jObjects) {
                        got(jObject);
                    }
                }
            };
            if (type.equals(Enums.Type.AJAX)) {
                bufferAccumulatedAjax = new MessageBufferStreamlined();
                messagePersistenceBuffer = new MessagePersistenceBuffer(bufferAccumulatedAjax, iGot);
                iSendBefore = messageAccumulator;
            } else {
                messagePersistenceBuffer = new MessagePersistenceBuffer(iSend, iGot);
                iSendBefore = messagePersistenceBuffer;
            }
            iGotBefore = messagePersistenceBuffer;

        } else {

            MyConsole.out.println(2);
            iGotBefore = new IGot() {
                @Override
                public void got(JSONObject jObject) {
                    try {
                        setsMessages(jObject);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }

                public void got(List<JSONObject> jObjects) {
                    for (JSONObject jObject : jObjects) {
                        got(jObject);
                    }
                }
            };
            MyConsole.out.println(3);
            iSendBefore = type.equals(Enums.Type.AJAX) ? messageAccumulator : iSend;
        }
        synchronized (instances) {
            instances.add(this);
        }

        MyConsole.out.println(4);
    }

    public static void setIGetInterpreter(IGetInterpreter iGetInterpreterIn) {
        iGetInterpreter = iGetInterpreterIn;
    }

    public <T> List<T> getAllInterfacesOfType(Class<T> c) {
        HashMap<String, Interpreter> map = (HashMap<String, Interpreter>) mapNameToInterpreter.clone();
        List<Interpreter> interpreters = new ArrayList<Interpreter>();
        for (Interpreter interpreter : map.values()) {
            for (Class i : interpreter.getClass().getInterfaces()) {
                if (i.isAssignableFrom(c)) {
                    interpreters.add(interpreter);
                }
            }
        }
        return (List<T>) interpreters;
    }

    public void got(String str) throws Exception {
        active = true;
        JSONObject jObject = new JSONObject(str);
        got(jObject);
    }

    public void connect(String name, String className) {
        Interpreter interpreter = iGetInterpreter.getInstance(this, className, name, type);
        if (interpreter != null) {
            mapNameToInterpreter.put(name, interpreter);
        }
    }

    public void close(String name) {
        Interpreter interpreter = mapNameToInterpreter.get(name);
        interpreter.close();
        mapNameToInterpreter.remove(name);
    }

    @Override
    public void send(JSONObject jObject, String name) {
        JSONObject jObjectMessage = new JSONObject();
        try {
            jObjectMessage.put("name", name);
            jObjectMessage.put("message", jObject);
        } catch (JSONException ex) {

        }
        iSendBefore.send(jObjectMessage);
    }

    @Override
    public void send(List<JSONObject> jObjects, String name) {
        List<JSONObject> toSend = new ArrayList<JSONObject>();
        Iterator<JSONObject> iterator = jObjects.iterator();
        while (iterator.hasNext()) {
            JSONObject jObjectMessage = new JSONObject();
            try {
                jObjectMessage.put("name", name);
                jObjectMessage.put("message", iterator.next());
            } catch (JSONException ex) {

            }
            toSend.add(jObjectMessage);
        }
        iSendBefore.send(toSend);
    }

    private JSONObject getEmptyMessage() {

        JSONObject jObject = new JSONObject();
        try {
            jObject.put("type", "empty");
        } catch (JSONException ex) {
        }
        return jObject;
    }

    public JSONObject getAccumulatedMessages(Boolean allowWaiting) throws JSONException {
        if (!isPersistent) {
            JSONObject message = messageAccumulator.getResponse(allowWaiting);
            return message==null?getEmptyMessage():message;
        } else {
            JSONObject jObject;
            Boolean doWait = false;
            synchronized (bufferAccumulatedAjax) {
                MyConsole.out.println("dssdsds");
                if ((!bufferAccumulatedAjax.isWaiting && allowWaiting)) {
                    doWait = true;

                } else {
                    MyConsole.out.println("ewqr");
                    if (bufferAccumulatedAjax.isWaiting) {

                        MyConsole.out.println("dsdfs");
                        return bufferAccumulatedAjax.getMessages(1).get(0);
                    } else {

                        MyConsole.out.println("dsdfers");
                        if (messageAccumulator.hasMessages && !allowWaiting) {
                            MyConsole.out.println("dsdfersddss");
                            jObject = messageAccumulator.getResponse(false);
                            if (jObject == null) {
                                return getEmptyMessage();
                            }
                            messagePersistenceBuffer.send(jObject);
                            return bufferAccumulatedAjax.getMessages(1).get(0);
                        } else {
                            return getEmptyMessage();
                        }
                    }
                }
            }
            if (doWait) {
                jObject = messageAccumulator.getResponse(true);
                if (jObject == null) {
                    return getEmptyMessage();
                }
                messagePersistenceBuffer.send(jObject);
                return bufferAccumulatedAjax.getMessages(1).get(0);
            }
            return null;//not reachable.
        }
    }

    public void close() {
        if (messagePersistenceBuffer != null) {
            messagePersistenceBuffer.close();
        }

        Iterator<String> iterator = mapNameToInterpreter.keySet().iterator();
        while (iterator.hasNext()) {
            mapNameToInterpreter.get(iterator.next()).close();

        }
    }

    public String getIp() {
        return (String) session.getAttribute("ip");
    }

    private void setsMessages(JSONObject jObject) throws JSONException, Exception {
        MyConsole.out.println("setsMessages: " + jObject.toString());
        active = true;
        JSONArray jArrayMessages = jObject.getJSONArray(("messages"));
        for (int i = 0; i < jArrayMessages.length(); i++) {
            JSONObject jObjectMessage = jArrayMessages.getJSONObject(i);
            String name = jObjectMessage.getString("name");
            Interpreter interpreter = mapNameToInterpreter.get(name);
            if (interpreter != null) {
                interpreter.interpret(jObjectMessage.getJSONObject("message"));
            }
        }

    }

    void got(JSONObject jObject) throws Exception {
        MyConsole.out.println(jObject.toString());
        iGotBefore.got(jObject);

    }

    private static class Timeout implements Runnable {

        private Thread thread;

        public Timeout() {
            thread = new Thread(this);
            thread.start();
        }

        @Override
        public void run() {
            StopWatch stopWatch = new StopWatch();
            while (Global.run) {
                try {
                    Thread.sleep(4000);
                    if (stopWatch.get_ms() > Configuration.timeoutMs) {
                        stopWatch.Reset();
                        synchronized (instances) {
                            Iterator<MySocket> iterator = instances.iterator();
                            while (iterator.hasNext()) {
                                MySocket mySocket = iterator.next();
                                if (!mySocket.active) {
                                    mySocket.close();
                                    iterator.remove();
                                    try {
                                        //mySocket.session.removeAttribute("mySocket"); DOnt do this because it often happens after the new page has already loaded and put the new ajax into session.
                                        //session will dispose of its self. taking the wrapper with it, or alternatively wrapper will be dereferenced when new one referenced.
                                    } catch (IllegalStateException ise) {

                                    }
                                } else {
                                    mySocket.active = false;
                                }
                            }
                        }
                    }
                } catch (InterruptedException ex) {
                    Logger.getLogger(MySocket.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

    }

}
