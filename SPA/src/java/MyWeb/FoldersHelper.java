package MyWeb;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class FoldersHelper
{
    
    public static String getSrcJavaFolder() throws UnsupportedEncodingException {
        return getSrcFolder()+"/java";
    }
    public static String getSrcJavaScriptFolder() throws UnsupportedEncodingException {
        return getSrcFolder()+"/javascript";
    }
    public static String getSrcXml() throws UnsupportedEncodingException {
        return getSrcFolder()+"/xml";
    }
    public static String getSrcFolder() throws UnsupportedEncodingException {
        String a = URLDecoder.decode(JavascriptSetup.class.getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
        a = a.substring(0, a.indexOf("/build/web/WEB-INF"));
        return a + "/src";
    }
    public static String getFullResourcePath(String a) throws UnsupportedEncodingException{
        return getSrcFolder()+a;
    }
}
