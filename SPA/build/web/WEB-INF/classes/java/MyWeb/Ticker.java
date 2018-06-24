/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.util.Set;
import java.util.HashSet;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author SoftwareEngineer7
 */
public class Ticker implements Runnable{

    private static Thread thread;
    private volatile static List<Tuple<Runnable, Integer>> toAdd = new ArrayList<Tuple<Runnable, Integer>>();

    private volatile static List<Runnable> toRemove = new ArrayList<Runnable>();

    public static void add(Runnable r, int d) {
        synchronized (toAdd) {
            toAdd.add(new Tuple<Runnable, Integer>(r, d));
        }
        initializeIfNotAlready();
    }
    public static void remove(Runnable r){
        synchronized (toRemove) {
            toRemove.add(r);
        }
    }
    private static void initializeIfNotAlready() {
        if (thread == null) {
                final Ticker t = new Ticker();
            thread = new Thread(t);
            thread.start();
            Context.addOnDestroyed(new Runnable() {
                @Override
                public void run() {
                    t.stop();
                }
            });
        }
    }
        private class Instance {
            private int delay;
            private long time;
            private Runnable r;

            public Instance(long now, Runnable r, Integer delay) {
                this.delay = delay;
                time = now + delay;
                this.r = r;
            }

            public void tick(long now, Instance instance) {
                while (time < now) {
                    time += delay;
                    r.run();
                }
            }
        }
        private Boolean stop = false;
        private Set<Instance> runnables = new HashSet<Instance>();

        @Override
        public void run() {
            while (!stop) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ex) {
                    System.out.println(ex);
                }
                long now = System.currentTimeMillis();
                synchronized (toAdd) {
                    if (toAdd.size() > 0) {
                        Iterator<Tuple<Runnable, Integer>> iterator = toAdd.iterator();
                        while (iterator.hasNext()) {
                            Tuple<Runnable, Integer> p = iterator.next();
                            runnables.add(new Instance(now, p.x, p.y));
                        }
                        toAdd.clear();
                    }
                }
                    Iterator<Instance> iterator = runnables.iterator();
                    while(iterator.hasNext()){
                        Instance instance = iterator.next();
                        instance.tick(now, instance);
                    }
                synchronized (toRemove) {
                    if (toRemove.size() > 0) {
                        Iterator<Runnable> iteratorRemove = toRemove.iterator();
                        while (iteratorRemove.hasNext()) {
                            runnables.remove(iteratorRemove.next());
                        }
                        toRemove.clear();
                    }
                }
            }
        }

        public void stop() {
            stop = true;
        }
}
