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

    private HashMap<String, Interpreter> mapNameToInterpreter = new HashMap<String, Interpreter>();
    private volatile boolean active = true;
    private Sessions.Session session;
    private Enums.Type type;
    private ISend iSend;
    private IGot iGotBefore;
    private ISend iSendBefore;
    private Boolean isPersistent;
    private MessagePersistenceBuffer messagePersistenceBuffer;
    private MessageAccumulator messageAccumulator;
    private MessageBufferStreamlined bufferAccumulatedAjax;

    public MySocket(ISend iSend, Sessions.Session session, Enums.Type type, Boolean isPersistent) {
        GuarbageWatch.add(this);
        this.iSend = iSend;
        this.type = type;
        this.session = session;
        this.isPersistent = isPersistent;
        if (type.equals(Enums.Type.AJAX)) {
            messageAccumulator = new MessageAccumulator();
        }
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

        MyConsole.out.println(4);
        MySocketInstances.getInstance().add(this);
    }
    //public Boolean getActive(){
        //return active;
    //}
    //public void setActive(){
      //  System.out.println("set active");
        //active = true;
   // }
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
        //setActive();
        JSONObject jObject = new JSONObject(str);
        got(jObject);
    }

    public void connect(String name, String className) {
        Interpreter interpreter = MySocketInstances.getInstance().getIGetInterpreter().getInstance(this, className, name, type);
        if (interpreter != null) {
        System.out.println(interpreter);
            mapNameToInterpreter.put(name, interpreter);
        }
    }

    public void close(String name) {
		System.out.println("called close");
        Interpreter interpreter = mapNameToInterpreter.get(name);
        interpreter.close(session);
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
        Exception ex = new Exception("called close 2");
        ex.printStackTrace();
        if (messagePersistenceBuffer != null) {
            messagePersistenceBuffer.close();
        }
        System.out.println("closing it now");
        Iterator<String> iterator = mapNameToInterpreter.keySet().iterator();
        while (iterator.hasNext()) {
                    String name = iterator.next();
                    System.out.println("closing: "+name);
            mapNameToInterpreter.get(name).close(session);

        }
        MySocketInstances.getInstance().remove(this);
    }

    public String getIp() {
        return (String) session.getAttribute("ip");
    }

    private void setsMessages(JSONObject jObject) throws JSONException, Exception {
        System.out.println("Incoming messages: " + jObject.toString());
        //setActive();
        JSONArray jArrayMessages = jObject.getJSONArray(("messages"));
        for (int i = 0; i < jArrayMessages.length(); i++) {
            JSONObject jObjectMessage = jArrayMessages.getJSONObject(i);
            String name = jObjectMessage.getString("name");
            Interpreter interpreter = mapNameToInterpreter.get(name);
            if (interpreter != null) {
                interpreter.interpret(jObjectMessage.getJSONObject("message"), session);
            }
        }

    }

    void got(JSONObject jObject) throws Exception {
        System.out.println(jObject.toString());
        iGotBefore.got(jObject);

    }
}
