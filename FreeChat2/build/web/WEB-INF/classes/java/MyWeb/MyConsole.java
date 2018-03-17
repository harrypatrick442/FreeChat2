/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;


/**
 *
 * @author EngineeringStudent
 */
public class MyConsole {
    public static class out{
        public static void println(String str)
        {
            if(Configuration.consoleEnabled)
           System.out.println(str);
        }
        public static void println(Boolean b)
        {
            if(Configuration.consoleEnabled)
            System.out.println(b);
        }
        public static void println(long l)
        {
            if(Configuration.consoleEnabled)
            System.out.println(l);
        }
        public static void println(int i)
        {
            if(Configuration.consoleEnabled)
            System.out.println(i);
        }
        public static void println(Exception ex)
        {
            if(Configuration.consoleEnabled)
            System.out.println(ex);
        }
    }
}
