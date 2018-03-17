/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MyWeb;

/**
 *
 * @author SoftwareEngineer
 */
public class Controls {
    
    static String getControls() {
        StringBuffer sb = new StringBuffer();
        sb.append("<!DOCTYPE html>");
        sb.append("<html>");
        sb.append("<head>"
                + "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">"
                + "<meta name=\"description\" content=\"Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!\" />"
                + "<meta http-equiv=\"cache-control\" content=\"max-age=0\" />"
                + "<meta http-equiv=\"cache-control\" content=\"no-cache\" />"
                + "<meta http-equiv=\"expires\" content=\"0\" />"
                + "<meta http-equiv=\"expires\" content=\"Tue, 01 Jan 1980 1:00:00 GMT\" />"
                + "<meta http-equiv=\"pragma\" content=\"no-cache\" />");
        sb.append("</head>");
        sb.append("<body>");
        sb.append("<link rel='stylesheet' type='text/css' href='styles/room.css'/>");
        String timeString = Long.toString(System.currentTimeMillis());
        for (String path : Configuration.getStylesToLoad()) {
            ServletHelper.addStyle(sb, path, timeString);
        }
        sb.append("<script type='text/javascript'>");
        JavascriptSetup.getFileContent("/MyWeb/scripts/ajax.js", sb);
        JavascriptSetup.getFileContent("/FreeChat2/scripts/spinner.js", sb);
        JavascriptSetup.getFileContent("/FreeChat2/scripts/controls.js", sb);
        sb.append("\n");
        sb.append("</script>");
        sb.append("</body>");
        sb.append("</html>");
        return sb.toString();
    }
}
