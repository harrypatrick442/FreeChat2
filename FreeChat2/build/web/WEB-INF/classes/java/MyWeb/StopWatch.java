package MyWeb;

import java.io.Serializable;



/**
 * Created by EngineeringStudent on 10/07/2015.
 */
public class StopWatch implements Serializable
{
    private long startTime;
    public StopWatch()
    {
       GuarbageWatch.add(this) ;
        startTime = System.nanoTime();


    }
    public void Reset()
    {
        startTime=System.nanoTime();
    }
    public long get_s()
    {
        return (System.nanoTime()- startTime)/1000000000;
    }
    public long get_ms()
    {
        return (System.nanoTime()- startTime)/1000000;
    }
    public void set_ms(long value)
    {
        startTime=System.nanoTime()-(1000000*value);
    }
}
