/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Emailing;



/**
 *
 * @author EngineeringStudent
 */
public class Email {
    private String from;
    private String to;
    private String subject;
    private String message;
    public Email(String from, String to, String subject, String message)
    {
        this.from=from;
        this.to=to;
        this.subject=subject;
        this.message=message;
    }
    public String getFrom()
    {
        return from;
    }
    public String getTo()
    {
        return to;
    }
    public String getSubject()
    {
        return subject;
    }
    public String getMessage()
    {
        return message;
    }
}
