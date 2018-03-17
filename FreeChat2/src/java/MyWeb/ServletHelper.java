package MyWeb;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import javax.servlet.http.HttpServlet;
public class ServletHelper extends HttpServlet {

    public static void addScript(StringBuffer sb, String path, String timeString) {
        sb.append("<script type='text/javascript' src='");
        sb.append(path);
        sb.append("?t=");
        sb.append(timeString);
        sb.append("'></script>");
    }

    public static void addStyle(StringBuffer sb, String path, String timeString) {
        sb.append("<link rel='stylesheet' type='text/css' href='");
        sb.append(path);
        sb.append("?t=");
        sb.append(timeString);
        sb.append("'></link>");
    }

}
