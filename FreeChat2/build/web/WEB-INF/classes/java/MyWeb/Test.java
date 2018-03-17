/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import MySocket.Enums;
import MySocket.IMySocketClient;
import MySocket.MySocketClientSpawner;
import MySocket.MySocketClientSpawner.MySocketClient;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer7
 */
public class Test implements IMySocketClient {

    private MySocketClientSpawner mySocketClientSpawner;
    private MySocketClient mySocketClient;

    @Override
    public void onmessage(JSONObject jObject) {
        MyConsole.out.println("ONMESSAGE" + jObject.toString());
    }

    @Override
    public void onopen() {
        try {
            JSONObject jObject = new JSONObject(0);
            jObject.put("type", "test");
            mySocketClient.send(jObject);
            MyConsole.out.println("ONOPEN");
        } catch (JSONException ex) {
        }
    }

    @Override
    public void onclose() {
        MyConsole.out.println("ONCLOSE");
    }

    private void run() throws URISyntaxException {
        //"http://localhost/ServletMySocket"
        MyConsole.out.println("spawn");
        mySocketClientSpawner = new MySocketClientSpawner(true, Enums.Type.WebSocket, new URI("ws://localhost/EndpointMySocket"));
        //mySocketClientSpawner = new MySocketClientSpawner(true, Enums.Type.AJAX, new URI("http://localhost/ServletMySocket"));
        mySocketClient = mySocketClientSpawner.spawn(this, "test");
        MyConsole.out.println("spawndone");
    }

    public static void run(PrintWriter printWriter) throws URISyntaxException {

        try {
            new Test().run();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        /*
         MessagePersistenceBuffer messagePersistenceBufferSender = null;
         IGot iGot = new IGot() {

         public void got(JSONObject jObject) {
         MyConsole.out.println("at called got on: " + jObject.toString());

         }

         ;
         public void got(List<JSONObject> jObjects) {
         for (JSONObject jObject : jObjects) {
         MyConsole.out.println("at called got on: " + jObject.toString());
         }
         }
         ;
         };
     
         class Sender implements ISend {

         boolean first = true;
         private MessagePersistenceBuffer messagePersistenceBufferSender;

         @Override
         public void send(final JSONObject jObject) {
         int i = Random.Integer(0, 3);
         //MyConsole.out.println("sent: " + jObject.toString());
         if (i < 1 && !first) {
         new Thread(new Runnable() {
         @Override
         public void run() {

         messagePersistenceBufferSender.got(jObject);
         }
         }
         ).start();
         }
         first = false;
         }

         @Override
         public void send(List<JSONObject> jObjects) {
         //MyConsole.out.println("sent: " + jObjects.toString());
         }

         public void setPersistenceBufferSenderMessage(MessagePersistenceBuffer messagePersistenceBufferSender) {
         this.messagePersistenceBufferSender = messagePersistenceBufferSender;
         }

         }
         Sender sender = new Sender();
         messagePersistenceBufferSender = new MessagePersistenceBuffer(sender, iGot);
         sender.setPersistenceBufferSenderMessage(messagePersistenceBufferSender);
         for (int i = 0; i < 300; i++) {
         JSONObject jObject = new JSONObject();
         try {
         jObject.put("message", "dsfdsf" + i);
         //MyConsole.out.println(jObject.toString());
         } catch (JSONException ex) {
         ex.printStackTrace();
         }
         messagePersistenceBufferSender.send(jObject);
         }*/
    }
}
