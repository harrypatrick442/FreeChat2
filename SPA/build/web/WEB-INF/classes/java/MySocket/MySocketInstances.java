/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.ApplicationLifetime;
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
public class MySocketInstances{

    private static MySocketInstances mySocketInstances = new MySocketInstances();
    private HashMap<String, IGetInterpreter> mapClassNameToIGetInterpreter = new HashMap<String, IGetInterpreter>();
    private volatile List<MySocket> instances = new ArrayList<MySocket>();
    private IGetInterpreter iGetInterpreter;
    private StopWatch stopWatch = new StopWatch();

    private MySocketInstances() {
        GuarbageWatch.add(this);
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
    public void remove(MySocket mySocket){
        synchronized(instances){
            instances.remove(mySocket);
        }
    }
    public static MySocketInstances getInstance(){
        if(mySocketInstances==null){
            mySocketInstances = new MySocketInstances();
            ApplicationLifetime.hold(mySocketInstances);
            }
        return mySocketInstances;
    }
}
