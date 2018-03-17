/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import static MyWeb.JavascriptSetup.convertStreamToString;
import java.io.InputStream;
import org.apache.commons.lang.StringEscapeUtils;

/**
 *
 * @author EngineeringStudent
 */
















public class Xml {
    public static String getEscapedFileContentForJavaScript(String path, StringBuffer sb)
    {
        InputStream inputStream = Xml.class.getResourceAsStream(path);
        String str = StringEscapeUtils.escapeJavaScript(convertStreamToString(inputStream));
        sb.append(str);
        return str;
    }
}
