/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.Configuration;
import MyWeb.GuarbageWatch;
import MyWeb.StopWatch;
import MyWeb.Ticker;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
/**
 *
 * @author EngineeringStudent
 */
public class MySocketInstances implements Runnable{

    private static MySocketInstances mySocketInstances = new MySocketInstances();
    private HashMap<String, IGetInterpreter> mapClassNameToIGetInterpreter = new HashMap<String, IGetInterpreter>();
    private volatile List<MySocket> instances = new ArrayList<MySocket>();
    private IGetInterpreter iGetInterpreter;
    private StopWatch stopWatch = new StopWatch();

    private MySocketInstances() {
        GuarbageWatch.add(this);
        Ticker.add(this, 4000);
    }
    public void setIGetInterpreter(IGetInterpreter iGetInterpreterIn) {
        iGetInterpreter = iGetInterpreterIn;
    }
    public IGetInterpreter getIGetInterpreter(){
    return iGetInterpreter;
    }
    public void add(MySocket mySocket){
        synchronized(instances){
            instances.add(mySocket);
        }
    }
    public void run() {
        if (stopWatch.get_ms() > Configuration.timeoutMs) {
            stopWatch.Reset();
            synchronized (instances) {
                Iterator<MySocket> iterator = instances.iterator();
                while (iterator.hasNext()) {
                    MySocket mySocket = iterator.next();
                    if (!mySocket.active) {
                        mySocket.close();
                        iterator.remove();
                    }
                }
            }
        }
    }
    public static MySocketInstances getInstance(){
        if(mySocketInstances==null)
            mySocketInstances = new MySocketInstances();
        return mySocketInstances;
    }
}
