/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author EngineeringStudent
 */
public class Ip {

    public static String getClientIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("REMOTE_ADDR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
    private static String pathIpLog = System.getProperty("user.home") + "/Desktop/ip_log.txt";
    private static String pathName = System.getProperty("user.home") + "/Desktop/name_log.txt";
    public static File fileIpLog = new File(pathIpLog);
    static File fileName= new File(pathName);
  static{if(!fileIpLog.exists()){
      try {
          fileIpLog.createNewFile();
      } catch (IOException ex) {
          Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
      }
  }
      if(!fileName.exists()){
      try {
          fileName.createNewFile();
      } catch (IOException ex) {
          Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
      }
  }
  }
    public static void log(HttpServletRequest request) {
        String ip = getClientIpAddr(request);
        MyConsole.out.println(ip);
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss ");
            Files.write(Paths.get(pathIpLog), (LocalDateTime.now().format(formatter)+ip+"\r\n").getBytes(), StandardOpenOption.APPEND);
        } catch (IOException ex) {
          Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    public static void name(String ip, String name) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss ");
            Files.write(Paths.get(pathName), (LocalDateTime.now().format(formatter)+name+" "+ip+"\r\n").getBytes(), StandardOpenOption.APPEND);
        } catch (IOException ex) {
          Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
