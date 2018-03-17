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
public class TimeOffset {

    private static long timeOffset = Long.MIN_VALUE;

    public static long get() {
        if (timeOffset == Long.MIN_VALUE) {
            timeOffset = 0;//System.currentTimeMillis() - ZonedDateTime.now(ZoneOffset.UTC).toInstant().toEpochMilli();
        }
        return timeOffset;
    }
}
