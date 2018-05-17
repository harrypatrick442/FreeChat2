/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import static java.lang.System.gc;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 *
 * @author EngineeringStudent
 */
public class SpeedTest {

    private static class LogEntry {

        public long time;
        public String description;

        public LogEntry(String description) {
            time = System.currentTimeMillis();
            this.description = description;
        }
    }
    private static List<LogEntry> logEntries = new ArrayList<LogEntry>();

    public static void log(String description) {
        logEntries.add(new LogEntry(description));
    }

    public static void printAndClear() {
        LogEntry logEntryPrevious = null;
        for (LogEntry logEntry : logEntries) {
            if (logEntryPrevious == null) {
                logEntryPrevious = logEntry;
            } else {
                System.out.print("FROM: \"");
                System.out.print(logEntryPrevious.description);
                System.out.print("\" TO: \"" + logEntry.description + "\": " + (logEntry.time - logEntryPrevious.time));
                System.out.println("ms");
                logEntryPrevious = logEntry;
            }
        }
        logEntries.clear();
    }
}
