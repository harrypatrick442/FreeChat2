/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Email {
    public String from;
    public String to;
    public String subject;
    public String message;
    public Email(String from, String to, String subject, String message)
    {
       GuarbageWatch.add(this) ;
        this.from=from;
        this.to=to;
        this.subject=subject;
        this.message=message;
    }
}
