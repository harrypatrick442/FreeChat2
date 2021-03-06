/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import FreeChat2.Users;
import MyWeb.ImageProcessing;
import MyWeb.JavascriptSetup;
import MyWeb.Tuple;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.util.Base64;
import javax.imageio.ImageIO;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class Pictures {

    private static String[] imagesProfileFolder = null;
    private static String[] getImagesProfileFolder() throws UnsupportedEncodingException
    {
        if(imagesProfileFolder==null)
        {
            String a = URLDecoder.decode(JavascriptSetup.class.getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
            a=a.substring(0, a.indexOf("/build/web/WEB-INF"));
            imagesProfileFolder = new String[]{a+"/build/web/images/profile/", a+"/web/images/profile/"};
        }
        return imagesProfileFolder;
    }
    public static Result Save(JSONObject jObject) throws JSONException {
        boolean crop = jObject.getBoolean("crop");
        String data = jObject.getString("data");
        Base64.Decoder decoder = Base64.getDecoder();
        if (data != null) {
            if (!data.equals("")) {
                try {
        System.out.println(data);
        System.out.println("save");
                    BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(decoder.decode(data)));
                    if (bufferedImage != null) {
                        while (true) {
                            if (crop) {
                                bufferedImage = ImageProcessing.crop(bufferedImage, jObject.getInt("x"), jObject.getInt("y"), jObject.getInt("w"), jObject.getInt("h"));
                                if (bufferedImage==null) {
                                    return new Result(false, "profile picture cropping failed!");
                                }
                            }
                            String[] folders=getImagesProfileFolder();
                            String relativePath = ImageProcessing.save(bufferedImage, folders);
                            return new Result(relativePath, true);
                        }
                    }
                } catch (IOException ex) {
                    System.out.println(ex);
                } catch (IllegalArgumentException ex) {
                    System.out.println(ex);
                }
            }
        }
        return new Result(false, "An error occured uploading the image, please try again");
    }

}
