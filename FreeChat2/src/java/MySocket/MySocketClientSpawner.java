/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.Ajax;
import MyWeb.GuarbageWatch;
import MyWeb.IClose;
import MyWeb.Timer;
import MyWeb.MyConsole;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer
 */
public class MySocketClientSpawner implements ISocket, IGot {

    private volatile String sessionId;
    private volatile Boolean run = true;
    private URI uri;
    private Enums.Type type;
    private MessagePersistenceBuffer messagePersistenceBuffer;
    private int timeoutConnect = 5000;
    private int timeoutRead = 5000;
    private ISend send;
    private IGot processMessages;
    private final ISend _sendMessages;
    private Timer timerRead;
    private Timer timerSend;
    private Timer timerOnClose;
    private Timer timerPing;
    private final int ajaxTimeout = 20000;
    private final int closeTimeout = 30000;
    private Boolean closedAll = false;
    private IWebSocket iWebSocket;
    private Boolean isPersistent;
    private Boolean initialized = false;
    private InitializationHandler initializationHandler;
    private List<JSONObject> listToSend = new ArrayList<JSONObject>();
    private List<MySocketClient> openSockets = new ArrayList<MySocketClient>();
    private HashMap<String, MySocketClient> mapNameToInstance = new HashMap<String, MySocketClient>();
    private List<MySocketClient> instances = new ArrayList<MySocketClient>();
    private CountDownLatch countDownLatchInitialization = new CountDownLatch(1);
    private volatile Map<String, ConnectionHandler> mapNameToConnectionHandler = new HashMap<String, ConnectionHandler>();

    public MySocketClientSpawner(final Boolean isPersistent, final Enums.Type type, final URI uri) {
        
            GuarbageWatch.add(this);
        this.type = type;
        this.isPersistent = isPersistent;
        this.uri = uri;
        initializationHandler = new InitializationHandler();
        if (this.type.equals(Enums.Type.WebSocket)) {
            send = new ISend() {
                @Override
                public void send(JSONObject jObjectIn) {
                    JSONObject jObject = new JSONObject();
                    try {
                        jObject.put("type", "messages");
                        jObject.put("data", jObjectIn);
                        //jObject.put("persistent", isPersistent);
                        iWebSocket.send(jObject);
                    } catch (JSONException ex) {
                    }

                }

                @Override
                public void send(List<JSONObject> jObjects) {
                    for (JSONObject jObject : jObjects) {
                        send(jObject);
                    }
                }
            };
        } else {
            send = new ISend() {
                @Override
                public void send(JSONObject jObjectIn) {
                    Map<String, String> parameters = new HashMap<String, String>();
                    parameters.put("t", (Long.toString(System.currentTimeMillis())));
                    parameters.put("type", "messages");
                    parameters.put("session_id", sessionId);
                    parameters.put("data", jObjectIn.toString());
                    Ajax.Response response = Ajax.doPost(uri.toString(), timeoutConnect, timeoutRead, parameters, null);
                    if (response.successful) {
                        try {
                            MyConsole.out.println(response.response);
                            processResponses(new JSONObject(response.response));
                        } catch (JSONException ex) {

                        }
                    }

                }

                @Override
                public void send(List<JSONObject> jObjects) {
                    for (JSONObject jObject : jObjects) {
                        send(jObject);
                    }
                }
            };
        }

        if (isPersistent) {
            messagePersistenceBuffer = new MessagePersistenceBuffer(send, this);
        }
        processMessages = (isPersistent ? messagePersistenceBuffer : this);
        _sendMessages = (isPersistent ? messagePersistenceBuffer : send);
    }

    private void sendMessages() {
        if (timerRead != null) {
            timerRead.reset();
        }
        if (timerSend == null) {
            timerSend = new Timer(
                    new IRun() {
                        @Override
                        public void run() {
                            JSONObject jObject = new JSONObject();
                            JSONArray jArray = new JSONArray();
                            synchronized (listToSend) {
                                for (JSONObject jObjectMessage : listToSend) {
                                    jArray.put(jObjectMessage);
                                }
                                listToSend.clear();
                            }
                            try {
                                jObject.put("messages", jArray);
                            } catch (JSONException ex) {
                            }
                            _sendMessages.send(jObject);
                        }
                    }, 500, 1);
        } else {
            timerSend.reset();
            if (!type.equals(Enums.Type.AJAX)) {
                timerPing.reset();
            }
        }

    }

    private void funcRead() {
        while (run) {
            Map<String, String> parameters = new HashMap<String, String>();
            parameters.put("t", (Long.toString(System.currentTimeMillis())));
            parameters.put("type", "read");
            parameters.put("session_id", sessionId);
            try {
                Ajax.Response response = Ajax.doPost(uri.toString(), ajaxTimeout, ajaxTimeout, parameters, null);
                if (response.successful) {
                    String str = response.response;
                    if (str != null && str != "") {
                        try {
                            processResponses(new JSONObject(str));
                        } catch (JSONException ex) {
                            ex.printStackTrace();
                        }
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    private void read() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                funcRead();
            }
        }).start();
    }

    public void finalize() throws Throwable {
        if (type.equals(Enums.Type.AJAX)) {
            try {
                Map<String, String> parameters = new HashMap<String, String>();
                parameters.put("t", (Long.toString(System.currentTimeMillis())));
                parameters.put("type", "disconnect");
                parameters.put("session_id", sessionId);
                Ajax.doPost(uri.toString(), timeoutConnect, timeoutRead, parameters, null);
            } finally {
                super.finalize();
            }
        }
    }

    private void closeAll() {
        MyConsole.out.println("CLOSE ALL");
        closedAll = true;
        synchronized (openSockets) {
            while (openSockets.size() > 0) {
                //return;
                //XXX needs some work;
                MySocketClient instance = openSockets.get(0);
                instance.close();
            }
        }
        if (type.equals(Enums.Type.WebSocket)) {
            iWebSocket.close();
        }
    }

    public final void processResponses(JSONObject jObject) {
        if (timerOnClose != null) {
            timerOnClose.reset();
        }
        try {
            String type = jObject.getString("type");
            if (type.equals("messages")) {
                processMessages.got(jObject.getJSONObject("messages"));
            }
            if (type.equals("empty")) {
                return;
            }
            if (type.equals("ping")) {
                return;
            }
            if (type.equals("is_disconnected")) {
                run = false;
                timerOnClose.stop();
                closeAll();
                return;
            }
        } catch (JSONException ex) {
        }

    }

    private void initialize() throws InitializationException {
        try {
            if (initialized) {
                return;
            }
            if (timerOnClose != null) {
                timerOnClose.reset();
            } else {
                timerOnClose = new Timer(new IRun() {
                    @Override
                    public void run() {
                        closeAll();
                    }
                }, closeTimeout < ajaxTimeout + 5000 ? ajaxTimeout + 5 : closeTimeout, 1);
            }
            run = true;
            closedAll = false;
            if (type.equals(Enums.Type.AJAX)) {

                Map<String, String> parameters = new HashMap<String, String>();
                parameters.put("t", (Long.toString(System.currentTimeMillis())));
                parameters.put("type", "initialize");
                parameters.put("persistent", isPersistent.toString());
                Ajax.Response response = Ajax.doPost(uri.toString(), timeoutConnect, timeoutRead, parameters, null);
                if (response.successful) {
                    String str = response.response;
                    try {
                        JSONObject jObject = new JSONObject(str);
                        sessionId = jObject.getString("session_id");
                        if (type.equals(Enums.Type.AJAX)) {
                            read();
                        }
                        return;
                    } catch (JSONException ex) {
                        throw new InitializationException(ex);
                    }
                }
                throw new InitializationException();
            } else {
                if (timerPing == null) {
                    timerPing = new Timer(new IRun() {
                        @Override
                        public void run() {
                            try {
                                JSONObject jObject = new JSONObject();
                                jObject.put("type", "ping");
                                iWebSocket.send(jObject);
                            } catch (JSONException ex) {
                                Logger.getLogger(MySocketClientSpawner.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                    }, ajaxTimeout, -1);
                }
                iWebSocket = isPersistent ? new PersistentWebSocket(this, uri) : new WebSocket(this, uri);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new InitializationException(ex);
        }
    }

    public void onopen() {
        //initializationHandler.run();
    }

    public void onclose() {
    }

    public void onmessage(JSONObject jObject) {

        try {
            String type = jObject.getString("type");
            if (type.equals("connected")) {
                String name = jObject.getString("name");
                synchronized (mapNameToConnectionHandler) {
                    ConnectionHandler connectionHandler = mapNameToConnectionHandler.get(name);
                    if (connectionHandler != null) {
                        connectionHandler.gotConnected();
                        mapNameToConnectionHandler.remove(name);
                        MyConsole.out.println("CONNECTING DONE");
                    }

                }
                return;
            } else {
                if (type.equals("opened")) {
                    JSONObject jObjectReply = new JSONObject();
                    jObjectReply.put("type", "initialize");
                    jObjectReply.put("persistent", isPersistent);
                    iWebSocket.send(jObjectReply);
                    return;
                }
                if (type.equals("initialized")) {
                    sessionId = jObject.getString("session_id");
                    initializationHandler.gotInitialized();
                    return;
                }
            }
        } catch (Exception ex) {
        }
        MyConsole.out.println("onmessage:jObject" + jObject);
        processResponses(jObject);
    }

    private void removeFromOpen(MySocketClient mySocketClient) {
        synchronized (openSockets) {
            openSockets.remove(mySocketClient);
        }
    }

    private void _processMessage(JSONObject jObject) {
        try {
            MySocketClient instance;
            synchronized (mapNameToInstance) {
                instance = mapNameToInstance.get(jObject.getString("name"));
            }
            if (instance != null) {
                try {
                    instance.got(jObject.getJSONObject("message"));
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        } catch (JSONException ex) {
            ex.printStackTrace();
        }
    }

    private void _processMessages(JSONObject jObject) {
        try {
            JSONArray messages = jObject.getJSONArray("messages");
            for (int j = 0; j < messages.length(); j++) {

                JSONObject message = messages.getJSONObject(j);
                _processMessage(message);
            }
        } catch (JSONException ex) {
            _processMessage(jObject);
        }
    }

    private int nName = 0;

    private String getNameString() {
        String str = "" + nName;
        nName++;
        return str;
    }

    @Override
    public void got(JSONObject jObject) {
        MyConsole.out.println("got: " + jObject.toString());
        _processMessages(jObject);
    }

    @Override
    public void got(List<JSONObject> jObjects) {
        for (JSONObject jObject : jObjects) {
            _processMessages(jObject);
        }
    }

    @Override
    public void onerror(Exception ex) {
        MyConsole.out.println(ex);
    }

    private interface IConnect {

        public void connect() throws ConnectionException;

        public void connected();
    }

    public MySocketClient spawn(IMySocketClient iMySocketClient, String className) {
        return new MySocketClient(iMySocketClient, className);
    }

    public class MySocketClient implements IClose, IGot, IConnect {

        private String name;
        private String className;
        private IMySocketClient iMySocketClient;
        private ConnectionHandler connectionHandler;

        public MySocketClient(IMySocketClient iMySocketClient, String className) {
            this.className = className;
            this.iMySocketClient = iMySocketClient;
            this.name = getNameString();
            synchronized (instances) {
                synchronized (mapNameToInstance) {

                    instances.add(this);
                    mapNameToInstance.put(name, this);
                }
            }
            if (!initialized) {
                initializationHandler.start();
            }
            connectionHandler = new ConnectionHandler(this, name);
            GuarbageWatch.add(this);
            
        }

        public void send(JSONObject jObjectMessage) {
            JSONObject jObject = new JSONObject();
            try {
                jObject.put("name", this.name);
                jObject.put("message", jObjectMessage);
                synchronized (listToSend) {
                    listToSend.add(jObject);
                }
                sendMessages();
            } catch (JSONException ex) {
            }
        }

        @Override
        public void close() {
            synchronized (instances) {
                synchronized (mapNameToInstance) {
                    instances.remove(this);
                    mapNameToInstance.remove(this.name);
                }
            }
            if (type.equals(Enums.Type.AJAX)) {
                Map<String, String> parameters = new HashMap<String, String>();
                parameters.put("t", (Long.toString(System.currentTimeMillis())));
                parameters.put("type", "close");
                parameters.put("name", name);
                parameters.put("session_id", sessionId);
                try {
                    Ajax.Response response = Ajax.doPost(uri.toString(), timeoutConnect, timeoutRead, parameters, null);
                } finally {
                }
            } else {
            }
            removeFromOpen(this);

            try {
                iMySocketClient.onclose();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        @Override
        public void connect() throws ConnectionException {

            if (type.equals(Enums.Type.AJAX)) {
                Map<String, String> parameters = new HashMap<String, String>();
                parameters.put("t", (Long.toString(System.currentTimeMillis())));
                parameters.put("type", "connect");
                parameters.put("name", name);
                parameters.put("class", className);
                parameters.put("session_id", sessionId);
                try {
                    Ajax.Response response = Ajax.doPost(uri.toString(), timeoutConnect, timeoutRead, parameters, null);
                    if (response.successful) {
                        String str = response.response;
                        JSONObject jObject = new JSONObject(str);
                        try {
                            if (jObject.getString("name").equals(name)) {
                                return;
                            }
                            return;
                        } catch (JSONException ex) {
                            throw new ConnectionException(ex);
                        }
                        //XXX replace interpreter make sure call close method so check in map on server if in it call close replace one name same.
                        //Have map outside connectionhandler scope and it maps name to connection handler. Have websocket connection reply and count down if its that type.
                    }
                } catch (Exception ex) {
                    throw new ConnectionException(ex);
                }
                throw new ConnectionException();
            } else {
                JSONObject jObject = new JSONObject();
                try {
                    jObject.put("type", "connect");
                    jObject.put("class", className);
                    jObject.put("name", name);
                    jObject.put("persistent", MySocketClientSpawner.this.isPersistent);
                    iWebSocket.send(jObject);
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }

        @Override
        public void got(JSONObject jObject) {
            try {
                iMySocketClient.onmessage(jObject);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        @Override
        public void got(List<JSONObject> jObjects) {
            for (JSONObject jObject : jObjects) {
                got(jObject);
            }
        }

        @Override
        public void connected() {
            if (!openSockets.contains(this)) {
                openSockets.add(this);
            }
            try {
                iMySocketClient.onopen();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public class InitializationException extends Exception {

        public InitializationException() {
            super();
        }

        public InitializationException(String message) {
            super(message);
        }

        public InitializationException(Exception ex) {
            super(ex);
        }
    }

    public class ConnectionException extends Exception {

        public ConnectionException() {
            super();
        }

        public ConnectionException(String message) {
            super(message);
        }

        public ConnectionException(Exception ex) {
            super(ex);
        }
    }

    private class InitializationHandler implements Runnable {

        private Thread thread;
        private volatile Boolean running = false;
        private volatile Boolean done = false;

        public InitializationHandler() {
            thread = new Thread(this);
            if (type.equals(Enums.Type.AJAX)) {
                done = true;
            }
            GuarbageWatch.add(this);
        }

        public void start() {
            synchronized (running) {
                if (!running) {
                    running = true;
                    thread.start();
                }
            }
        }

        @Override
        public void run() {
            try {
                while (run) {
                    try {
                        initialize();
                        if (!type.equals(Enums.Type.AJAX)) {
                            int sleep = 250;
                            while (sleep < 3000 && run) {
                                Thread.sleep(sleep);
                                if (done) {
                                    break;
                                }
                                sleep += 500;
                            }
                        } else {
                            done = true;
                        }
                        if (done) {
                            countDownLatchInitialization.countDown();
                            break;
                        }
                    } catch (InitializationException ex) {
                        ex.printStackTrace();
                        try {
                            Thread.sleep(3000);
                        } catch (InterruptedException ex1) {

                        }
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            initialized = true;
        }

        private void gotInitialized() {
            done = true;
        }
    }

    private class ConnectionHandler implements Runnable {

        private IConnect iConnect;
        private volatile boolean done = false;

        public ConnectionHandler(IConnect iConnect, String name) {
            this.iConnect = iConnect;
            synchronized (mapNameToConnectionHandler) {
                mapNameToConnectionHandler.put(name, this);
            }
            new Thread(this).start();
            GuarbageWatch.add(this);
        }

        @Override
        public void run() {
            try {
                countDownLatchInitialization.await();
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
            while (!done && run) {
                try {
                    iConnect.connect();
                    if (type.equals(Enums.Type.AJAX)) {
                        break;
                    } else {
                        int sleep = 250;
                        while (sleep < 3000 && run) {
                            Thread.sleep(sleep);
                            if (done) {
                                break;
                            }
                            sleep += 500;
                        }
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                try {
                    if (!done) {
                        Thread.sleep(3000);
                    } else {
                        break;
                    }
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
            }
            iConnect.connected();
        }

        private void gotConnected() {
            done = true;
        }
    }
}

interface IProcessMessages {

    public void _processMessages(JSONObject jObject);
}
