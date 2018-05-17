/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer
 */
public class PersistentWebSocket implements IWebSocket {

    private URI uri;
    private ISocket iSocket;
    private ISocket iSocketInternal;
    private WebSocket webSocket;
    private Boolean opened = false;
    private volatile Boolean setClosed = false;
    private StopWatch stopWatchCreated = new StopWatch();

    public PersistentWebSocket(final ISocket iSocket, URI uri) throws URISyntaxException, Exception {
        this.uri = uri;
        this.iSocket = iSocket;
        createNew(false);
            GuarbageWatch.add(this);
    }

    private void createNew(Boolean repeatOnFailure) throws Exception {
        try {
            if (webSocket != null) {
                webSocket.close();
            }
            iSocketInternal = new ISocket() {

                @Override
                public void onopen() {
                    if (!opened && !setClosed) {
                        opened = true;
                        iSocket.onopen();
                    }
                }

                @Override
                public void onmessage(JSONObject jObject) {
                    iSocket.onmessage(jObject);
                }

                @Override
                public void onclose() {
                    if (!setClosed) {
                        try {
                            createNew(true);
                        } catch (Exception ex) {
                            //never thrown
                        }
                    }
                }

                @Override
                public void onerror(Exception ex) {
                    try {
                        createNew(true);
                    } catch (Exception ex2) {
                        //never thrown
                    }
                }
            };
            webSocket = new WebSocket(iSocketInternal, uri);
            stopWatchCreated.Reset();
        } catch (Exception ex) {
            if (!repeatOnFailure) {
                throw ex;
            } else {
                ex.printStackTrace();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ex2) {
                    ex2.printStackTrace();
                }
                createNew(true);
            }
        }
    }

    private void handleFailedSend() {
        if (stopWatchCreated.get_ms() > 3000 && !setClosed) {
            try {
                createNew(true);
            } catch (Exception ex) {//never thrown

            }
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        try {
            webSocket.send(jObjects);
        } catch (Exception ex) {
            ex.printStackTrace();
            handleFailedSend();
        }
    }

    @Override
    public void send(JSONObject jObject) {
        try {
            webSocket.send(jObject);
        } catch (Exception ex) {
            ex.printStackTrace();
            handleFailedSend();
        }
    }

    @Override
    public void close() {
        setClosed = true;
        try {
            webSocket.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
