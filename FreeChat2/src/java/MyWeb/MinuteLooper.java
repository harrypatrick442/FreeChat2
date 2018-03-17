/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author SoftwareEngineer7
 */
public class MinuteLooper{
    private static Looper looper = new Looper(60000);
    public static void add(InterfaceLooper i) {
        looper.add(i);
    }

    public static void remove(InterfaceLooper i) {
        looper.remove(i);
    }
}
