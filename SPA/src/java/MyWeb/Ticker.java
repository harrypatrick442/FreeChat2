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

/**
 *
 * @author SoftwareEngineer7
 */
public class Ticker {

    private static Thread thread;
    private volatile static List<Tuple<Runnable, Integer>> toAdd = new ArrayList<Tuple<Runnable, Integer>>();

    public static void add(Runnable r, int d) {
        synchronized (toAdd) {
            toAdd.add(new Tuple<Runnable, Integer>(r, d));
        }
        initializeIfNotAlready();
    }

    private static void initializeIfNotAlready() {
        if (thread == null) {
            final Runner r = new Runner();
            thread = new Thread(r);
            Context.addOnDestroyed(new Runnable() {
                @Override
                public void run() {
                    r.stop();
                }
            });
        }
    }

    private static class Runner implements Runnable {

        private class Instance {
            private int delay;
            private long time;
            private Runnable r;

            public Instance(long now, Runnable r, Integer delay) {
                this.delay = delay;
                time = now + delay;
                this.r = r;
            }

            public void tick(long now) {
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
                long now = System.currentTimeMillis();
                synchronized (toAdd) {
                    if (toAdd.size() > 0) {
                        Iterator<Tuple<Runnable, Integer>> iterator = toAdd.iterator();
                        while (iterator.hasNext()) {
                            Tuple<Runnable, Integer> p = iterator.next();
                            runnables.add(new Instance(now, p.x, p.y));
                        }
                    }
                    Iterator<Instance> iterator = runnables.iterator();
                    while(iterator.hasNext()){
                        Instance instance = iterator.next();
                        instance.tick(now);
                    }
                }
            }
        }

        public void stop() {
            stop = true;
        }
    }
}
