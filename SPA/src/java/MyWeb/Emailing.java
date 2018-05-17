/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 *
 * @author EngineeringStudent
 */
public class Emailing {
    public static void send(Email email) throws Exception{
        send(email.from, email.to, email.subject, email.message);
    }

    public static void send(String emailFrom, String emailTo, String subject, String messageString) throws Exception{
        final String username = "awonderfulmachine15@gmail.com";
        final String password = "fdsfde324432f";
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");
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
