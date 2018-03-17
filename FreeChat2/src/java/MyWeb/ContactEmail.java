/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class ContactEmail {
    public String emailFrom;
    public String emailTo;
    public String name;
    public String phone;
    public String subject;
    public String message;
    public ContactEmail(JSONObject jObject, String emailTo)throws JSONException
    {
       GuarbageWatch.add(this) ;
        this.emailTo=emailTo;
        try
        {
        emailFrom = jObject.getString("email");
        name=jObject.getString("name");
        phone=jObject.getString("phone");
        subject=jObject.getString("subject");
        message=jObject.getString("message");
        }
        catch(JSONException ex)
        {
            throw ex;
        }
    }
    public Email getEmail()
    {
        return new Email(emailFrom, emailTo, "CONTACT", "Subject: "+subject+ " \nFrom: "+name+" \nEmail: "+emailFrom+" \nPhone: "+phone+" \nMessage: "+message);
    }
}
