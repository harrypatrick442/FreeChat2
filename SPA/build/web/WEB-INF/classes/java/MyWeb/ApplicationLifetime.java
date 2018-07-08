package MyWeb;

import MySocket.AsynchronousSender;
import MySocket.IGetInterpreter;
import MySocket.MySocket;
import FreeChat2.InterpreterRoom;
import FreeChat2.Room;
import FreeChat2.RoomType;
import FreeChat2.Wall;
import MySocket.Enums;
import MySocket.MySocketInstances;
import MyWeb.Database.Database;
import Profiles.IConfigurationPassword;
import Profiles.IDatabase;
import Profiles.InterpreterProfiles;
import Youtube.InterpreterDownloader;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
    
public class ApplicationLifetime implements ServletContextListener, Runnable{
    private static ArrayList<Object> list = new ArrayList<Object>();
    public static void hold(Object o){
        if(!list.contains(o))
            list.add(o);
    }
    private static Set<Runnable> onDestroyed = new HashSet<Runnable>();
    CountDownLatch countDownLatch = new CountDownLatch(1);
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        System.out.println("initialized the application lifetime.");
        new Thread(this).start();
    }
    public void run(){
        try {
            System.out.println("waiting ");
            countDownLatch.await();
            System.out.println("waited");
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        countDownLatch.countDown();
    }
}
