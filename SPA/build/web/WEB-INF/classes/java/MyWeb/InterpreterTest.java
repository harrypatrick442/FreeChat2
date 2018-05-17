/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import MySocket.AsynchronousSender;
import MyWeb.Sessions.Session;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer
 */
public class InterpreterTest extends Interpreter {

    private AsynchronousSender asynchronousSender;

    public InterpreterTest(AsynchronousSender asynchronousSender) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
    }

    public void interpret(JSONObject jObject, Session session) throws Exception {
        try {

            String type = jObject.getString("type");
            MyConsole.out.println(jObject.toString());
            if (type.equals("test")) {
                MyConsole.out.println("TEST");
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        int i=0;
                        while(i<11)
                        {
                            try {
                                JSONObject jObjectReply = new JSONObject();
                                jObjectReply.put("number", i);
                                asynchronousSender.send(jObjectReply);
                                try {
                                    Thread.sleep(2000);
                                } catch (InterruptedException ex) {
                                    Logger.getLogger(InterpreterTest.class.getName()).log(Level.SEVERE, null, ex);
                                }
                                i++;} catch (JSONException ex) {
                                Logger.getLogger(InterpreterTest.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                    }
                }).start();
            } else {
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public void close() {

    }
}
