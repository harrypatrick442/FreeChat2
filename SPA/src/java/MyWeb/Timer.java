/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import MySocket.IRun;

/**
 *
 * @author SoftwareEngineer7
 */
public class Timer {

    private IRun iRun;
    private int delayMs;
    private int times;
    private RunnableTimer runnableTimer;

    public Timer(IRun iRun, int delayMs, int times) {
        this.iRun = iRun;
        this.delayMs = delayMs;
        this.times = times;
        runnableTimer = new RunnableTimer();
    }

    public void reset() {
        if (runnableTimer != null) {
            runnableTimer.stop();
        }
        runnableTimer = new RunnableTimer();
    }

    public void stop() {
        runnableTimer.stop();
    }

    private class RunnableTimer implements Runnable {

        private Thread thread;
        private volatile boolean stopped = false;
        private int count = 0;

        public RunnableTimer() {
            thread = new Thread(this);
            thread.start();
        }

        @Override
        public void run() {
            while (!stopped) {
                if (times > 0) {
                    if (count >= times) {
                        break;
                    }
                    count++;
                }
                try {
                    Thread.sleep(delayMs);
                } catch (InterruptedException ex) {

                }
                if (stopped) {
                    break;
                }
                try {
                    iRun.run();
                } catch (Exception ex) {

                }
            }
        }

        public void stop() {
            stopped=true;
            if (!thread.interrupted()) {
                thread.interrupt();
            }
        }
    }
}
