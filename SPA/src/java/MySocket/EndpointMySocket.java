package MySocket;

import MySocket.Enums.Type;
import MyWeb.GuarbageWatch;
import MyWeb.Sessions;
import MyWeb.MyConsole;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.annotation.WebListener;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
@ServerEndpoint(value = "/EndpointMySocket")
@WebListener
public class EndpointMySocket implements ISend {

    private Sessions.Session session;
    private MySocket mySocket;
    private Session sessionWebsocket;

    @OnError
    public void onError(Session session, Throwable thr) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        thr.printStackTrace(pw);
        MyConsole.out.println(sw.toString());
    }

    @OnOpen
    public void onOpen(Session session) {
        GuarbageWatch.add(this);
        this.sessionWebsocket = session;
        JSONObject jObject = new JSONObject();
        try {
            jObject.put("type", "opened");
        } catch (JSONException ex) {
        }
        send(jObject);
    }

    private void createNew(Boolean isPersistent) {
        session = Sessions.getNew();
        mySocket = new MySocket(new ISend() {

            @Override
            public void send(JSONObject jObject) {
                try {
                    JSONObject jObjectMessages = new JSONObject();
                    jObjectMessages.put("messages", jObject);
                    jObjectMessages.put("type", "messages");
                    EndpointMySocket.this.send(jObjectMessages);
                } catch (JSONException ex) {
                }
            }

            @Override
            public void send(List<JSONObject> jObjects) {
                for (JSONObject jObject : jObjects) {
                    send(jObject);
                }
            }
        }, session, Type.WebSocket, isPersistent);
        session.setAttribute("mySocket", mySocket);
    }

    @OnMessage
    public void onMessage(String message, Session sessionWebsocket) {
        try {
            JSONObject jObject = new JSONObject(message);
            String type = jObject.getString("type");
            if (type.equals("initialize"))//not to be confused with internal interpreter one. This is for the outer ajax wrapper.
            {
                Boolean isPersistent = jObject.getBoolean("persistent");
                if (mySocket != null) {
                    mySocket.close();
                }
                createNew(isPersistent);
                JSONObject jObjectResponse = new JSONObject();
                jObjectResponse.put("type", "initialized");
                jObjectResponse.put("session_id", session.id);
                send(jObjectResponse);

            } else {
                if (mySocket == null) {
                    if (session == null) {
                        String sessionId = null;
                        try {
                            sessionId = jObject.getString("session_id");
                            if (sessionId != null && sessionId != "") {
                                session = Sessions.getSession(sessionId);

                            }
                        } catch (JSONException ex) {
                        }
                    }
                    if (session != null) {
                        mySocket = (MySocket) session.getAttribute("mySocket");
                    }
                }
                if (mySocket != null) {
                    session.wasActive();
                    System.out.println("mysocket not null");
                    System.out.println(mySocket.toString());
                    System.out.println(jObject.toString());
                    if (type.equals("ping")) {
                        send(jObject);
                    } else {
                        if (type.equals("messages")) {
                            JSONObject data = jObject.getJSONObject("data");
                            mySocket.got(data);
                        } else {
                            if (type.equals("connect"))//not to be confused with internal interpreter one. This is for the outer ajax wrapper.
                            {
                                String name = jObject.getString("name");
                                String className = jObject.getString("class");
                                mySocket.connect(name, className);
                                JSONObject jObjectResponse = new JSONObject();
                                jObjectResponse.put("type", "connected");
                                jObjectResponse.put("name", name);
                                jObjectResponse.put("session_id", session.id);
                                send(jObjectResponse);

                            } else {
                                if (type.equals("close")) {
                                    mySocket.close(jObject.getString("name"));

                                } else {
                                    if (type.equals("disconnect")) {
                                        mySocket.close();

                                    }
                                }
                            }

                        }
                    }
                } else {
                    try {
                        JSONObject jObjectResponse = new JSONObject();
                        jObjectResponse.put("type", "is_disconnected");
                        send(jObjectResponse);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                    mySocket.close();
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session userSession) {
        System.out.println("closed");
    }

    @Override
    public void send(JSONObject jObject) {
        MyConsole.out.println(jObject.toString());
        synchronized (sessionWebsocket) {
            try {
                sessionWebsocket.getBasicRemote().sendText(jObject.toString());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        for (JSONObject jObject : jObjects) {
            send(jObject);
        }
    }

}
/*
 else {
 JSONObject jObjectResponse = new JSONObject();
 jObjectResponse.put("is_disconnected", true);
 out.println(jObjectResponse.toString());
 }*/
