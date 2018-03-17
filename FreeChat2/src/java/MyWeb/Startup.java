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
import javax.servlet.ServletContextEvent;  
import javax.servlet.ServletContextListener;
public class Startup implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
       MyConsole.out.println("INITIALIZED");
        Configuration.initialize();
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        MyConsole.out.println("Shutting down!");
    }
}
