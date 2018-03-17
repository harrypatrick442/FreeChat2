/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.logging.Level;
import java.util.logging.Logger;
import MyWeb.MyConsole;

/**
 *
 * @author SoftwareEngineer
 */
public class StaticContent {

    static String get(String pageType) {
        StringBuffer sb = new StringBuffer();
        try {
            File file = new File(getFolder(false) + "/" + pageType + ".html");
            if (file.exists()) {
                BufferedReader br = null;
                try {
                    br = new BufferedReader(new FileReader(file));
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }
                } catch (Exception ex) {
                    MyConsole.out.println(ex);
                } finally {
                    if (br != null) {
                        try {
                            br.close();
                        } catch (IOException ex) {

                        }
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return sb.toString();
    }

    static void set(String pageType, String html) {
        Boolean built = true;
        for (int i = 0; i < 2; i++) {
            try {
                File file = new File(getFolder(built) + "/" + pageType + ".html");
                file.createNewFile();
                BufferedWriter writer = null;
                try {
                    writer = new BufferedWriter(new FileWriter(file));
                    writer.write(html);
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    try {
                        writer.close();
                    } catch (Exception e) {
                    }
                }
            } catch (UnsupportedEncodingException ex) {
                ex.printStackTrace();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
            built = false;
        }

    }
    static void clear() {
        Boolean built = true;
        for (int i = 0; i < 2; i++) {
            try {
                File folder = new File(getFolder(built));
                for(File file : folder.listFiles())
                {
                    file.delete();
                }
            } catch (UnsupportedEncodingException ex) {
                ex.printStackTrace();
            } 
            built = false;
        }

    }

    private static String getFolder(Boolean inBuild) throws UnsupportedEncodingException {
        String a = URLDecoder.decode(JavascriptSetup.class.getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
        a = a.substring(0, a.indexOf(inBuild ? "/web/WEB-INF" : "/build/web/WEB-INF"));
        return a + "/web/static_content";
    }

}
