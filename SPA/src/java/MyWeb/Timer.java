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
public class Timer implements IRemove<Timer.RunnableTimer>{

    private IRun iRun;
    private int delayMs;
    private int times;
    private RunnableTimer runnableTimer;

    public Timer(IRun iRun, int delayMs, int times) {
        this.iRun = iRun;
        this.delayMs = delayMs;
        this.times = times;
        runnableTimer = new RunnableTimer(this);
        Ticker.add(runnableTimer, delayMs);
    }

    public void reset() {
        if (runnableTimer != null) {
            runnableTimer.stop();
        }
        runnableTimer = new RunnableTimer(this);
        Ticker.add(runnableTimer, delayMs);
    }

    public void stop() {
        runnableTimer.stop();
    }

    @Override
    public void remove(RunnableTimer t) {
        Ticker.remove(t);
    }

    public class RunnableTimer implements Runnable {

        private volatile boolean stopped = false;
        private int count = 0;
        private IRemove<RunnableTimer> iRemove;
        public RunnableTimer(IRemove<RunnableTimer> iRemove) {
            this.iRemove = iRemove;
        }
        @Override
        public void run() {
                if (times > 0) {
                    if (count >= times) {
                        iRemove.remove(this);
                    }
                    count++;
                }
                if (stopped) {
                    iRemove.remove(this);
                }
                try {
                    iRun.run();
                } catch (Exception ex) {

                }
        }
        public void stop() {
            stopped=true;
        }
    }
}
