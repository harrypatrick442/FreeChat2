/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Emailing;

import Database.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.apache.commons.lang.NotImplementedException;
import org.apache.commons.lang.NullArgumentException;


/**
 *
 * @author EngineeringStudent
 */
public class EmailHelper {
    
    private static Properties properties = new Properties();

    public static void send(Email email) throws Exception{
        send(email.getFrom(), email.getTo(), email.getSubject(), email.getMessage());
    }

    public static void send(String emailFrom, String emailTo, String subject, String messageString) throws Exception{
        final String username = "brightonswingers@gmail.com";
        final String password = "Afucka9Afucka9";
        Properties props = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.socketFactory.port", "465");
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.port", "465");
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        try {
            Message message = new MimeMessage(session);
            if (emailFrom != null&&!emailFrom.equals("")) {
                message.setFrom(new InternetAddress(emailFrom));
            }
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailTo));
            if (subject != null&&!subject.equals("")) {
            message.setSubject(subject);
            }
            message.setText(messageString);
            Transport.send(message);

        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }
}
