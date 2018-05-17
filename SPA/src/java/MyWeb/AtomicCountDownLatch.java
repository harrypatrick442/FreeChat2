/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.util.concurrent.CountDownLatch;

/**
 *
 * @author SoftwareEngineer
 */
public class AtomicCountDownLatch {

    public CountDownLatch countDownLatch = new CountDownLatch(1);

    public void latch() {
        countDownLatch = new CountDownLatch(1);
    }

    public void await() throws InterruptedException {
        countDownLatch.await();
    }

    public void countDown() {
        countDownLatch.countDown();
    }
}
