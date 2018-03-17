/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2.scripts.others;

import MyWeb.Configuration;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.Socket;

/**
 *
 * @author EngineeringStudent
 */
public class MyConsole {

    private static PrintWriter printWriter;
    private final static Object obj = new Object();

    static {
        if (Configuration.debugging) {
            try {
                Socket echoSocket = new Socket("127.0.0.1", 8888);
                printWriter = new PrintWriter(echoSocket.getOutputStream(), true);
                out.println("sfdfds");
            } catch (Exception ex) {

            }
        }

    }

    public static class out {

        public static void println(String line) {
            if (Configuration.debugging) {
                synchronized (obj) {
                    printWriter.println(line);

                }
            }
        }

        public static void println(Exception ex) {
            if (Configuration.debugging) {
                synchronized (obj) {
                    StringWriter sw = new StringWriter();
                    PrintWriter pw = new PrintWriter(sw);
                    ex.printStackTrace(pw);
                    println(sw.toString());
                }
            }
        }
    }
}
