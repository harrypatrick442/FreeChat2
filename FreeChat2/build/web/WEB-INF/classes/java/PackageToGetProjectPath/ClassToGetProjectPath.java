/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PackageToGetProjectPath;

import MyWeb.JavascriptSetup;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 *
 * @author SoftwareEngineer
 */
public class ClassToGetProjectPath {
    public static String get() throws UnsupportedEncodingException
    {
    return    ClassToGetProjectPath.class.getCanonicalName();
   
      //   MyConsole.out.println(JavascriptSetup.class.getPackage().getName()+"/"+JavascriptSetup.class.getName());
    }
}
