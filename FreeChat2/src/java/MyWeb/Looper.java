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
public class Looper {

    public int SLEEP_MS = 60000;
    private List<InterfaceLooper> list = new ArrayList<InterfaceLooper>();
    private CountDownLatch countDownLatch = new CountDownLatch(1);

    public void add(InterfaceLooper i) {
        synchronized (list) {
            if (!list.contains(i)) {
                list.add(i);
            }
        }
        countDownLatch.countDown();
    }

    public void remove(InterfaceLooper i) {
        synchronized (list) {
            list.remove(i);
        }
    }

    public Looper(final int sleepMs) {
        new Thread(new Runnable() {

            @Override
            public void run() {
                while (true) {
                    int size;
                    synchronized (list) {
                        size = list.size();
                    }
                    if (size < 1) {
                        try {
                            countDownLatch = new CountDownLatch(1);
                            synchronized (list) {
                                size = list.size();
                            }
                            if (size < 1) {
                                countDownLatch.await();
                            }
                        } catch (InterruptedException ex) {
                        }
                    }
                    synchronized (list) {
                        Iterator<InterfaceLooper> iterator = list.iterator();
                        while (iterator.hasNext()) {
                            try {
                                AtomicBoolean remove = new AtomicBoolean(false);
                                iterator.next().run(remove);
                                if (remove.get()) {
                                    iterator.remove();
                                }
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                        }
                    }
                    try {
                        Thread.sleep(sleepMs);
                    } catch (InterruptedException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        }).start();
    }
}
