/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MyWeb;

/**
 *
 * @author SoftwareEngineer
 */
import FreeChat2.Rooms;
import MyWeb.Database.Database;
import Profiles.IDatabase;
import javax.servlet.ServletContextEvent;  
import javax.servlet.ServletContextListener;
import java.util.Set;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;
public class Context implements ServletContextListener {

    private static Set<Runnable> onDestroyed = new HashSet<Runnable>();
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
       MyConsole.out.println("Initialized");
        Configuration.initialize();
        try {
            IDatabase database = Database.getInstance();
            database.getLobbyToUsers().clear();
            database.getRoomUuidToUsers().exitAll();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        try {
            Database.getInstance().getLobbyToUsers().clear();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    public static void addOnDestroyed(Runnable r){
        if(!onDestroyed.contains(r))
            onDestroyed.add(r);
    }
}
