/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.GuarbageWatch;
import MyWeb.IClose;
import MyWeb.MyConsole;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import javax.websocket.ClientEndpoint;
import org.json.JSONObject;
import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;
import org.json.JSONException;

/**
 *
 * @author SoftwareEngineer
 */
@ClientEndpoint
public class WebSocket implements ISend, IClose, IWebSocket {

    private ISocket iWebSocket;
    private URI uri;

    public WebSocket(ISocket iWebSocket, URI uri) throws DeploymentException, IOException {
        this.iWebSocket = iWebSocket;
        this.uri = uri;
        WebSocketContainer container = ContainerProvider.getWebSocketContainer();
        container.connectToServer(this, uri);
            GuarbageWatch.add(this);
    }

    @Override
    public void send(JSONObject jObject) {
        this.session.getAsyncRemote().sendText(jObject.toString());
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        for (JSONObject jObject : jObjects) {
            send(jObject);
        }
    }

    @Override
    public void close() {
        try {
            session.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        } catch (NullPointerException ex) {
            ex.printStackTrace();
        }
    }

    Session session = null;

    @OnOpen
    public void onOpen(Session userSession) {
        MyConsole.out.println("opening websocket");
        this.session = userSession;
        iWebSocket.onopen();
    }

    @OnClose
    public void onClose(Session userSession, CloseReason reason) {
        MyConsole.out.println("closing websocket");
        this.session = null;
    }

    @OnMessage
    public void onMessage(String message) {
        try {
            JSONObject jObject = new JSONObject(message);
            iWebSocket.onmessage(jObject);
        } catch (JSONException ex) {
            ex.printStackTrace();
        }
    }
}
