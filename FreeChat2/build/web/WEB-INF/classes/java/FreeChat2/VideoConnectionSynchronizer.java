/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import java.util.ArrayList;

/**
 *
 * @author EngineeringStudent
 */
public class VideoConnectionSynchronizer {
    private static ArrayList<String> waiting = new ArrayList<String>();
    public static Boolean isReady(String myUsername, String theirUsername)
    {
        String checkFor = theirUsername+"_"+myUsername;
        if(waiting.contains(checkFor))
        {
            waiting.remove(checkFor);
            return true;
        }
        else
        {
            waiting.add(myUsername+"_"+theirUsername);
        }
        return false;
    }
}
