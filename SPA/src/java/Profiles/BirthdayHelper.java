/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import FreeChat2.Users;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

/**
 *
 * @author EngineeringStudent
 */
public class BirthdayHelper {
 public static long getMillis(int day, int month, int year)
 {
     return  new DateTime(year, month+1, day, 0, 0, DateTimeZone.UTC).getMillis();
 }
    public static String isValid(long millis) {
        return (System.currentTimeMillis()-millis)>568025136000L?null:"You must be 18 or older to join this site!";
    }
}
