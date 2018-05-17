/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import FreeChat2.Global;
import MyWeb.Ip;
import MyWeb.StopWatch;
import static MyWeb.Ip.getClientIpAddr;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author EngineeringStudent
 */
public class ImageProcessing {

    public static String getPreloadJavascript(ServletContext servletContext, String pageType) {
        StringBuilder sb = new StringBuilder();
        sb.append("var preloadedImages=[];var imagesToPreload=[");
        String webInfPath = servletContext.getRealPath("/");
        List<String> preloadPaths = new ArrayList<String>();
        preloadPaths.add("images/" + (pageType.contains("vid") ? "video_downloader/" : ""));
        for (String preloadPath : preloadPaths) {
            File directory = new File(webInfPath + "/"+ preloadPath);
        boolean first = true;
            for (File file : directory.listFiles()) {
                if (first) {
                    first = false;
                } else {
                    sb.append(",");
                }
                sb.append("window.thePageUrl+'");
                sb.append(preloadPath);
                sb.append(file.getName());
                sb.append("'");
            }
        }
        sb.append("]; var taskPreloadImages = new Task(function(){for(var i=0; i<imagesToPreload.length; i++){var img = new Image(); img.src=imagesToPreload[i]; preloadedImages.push(img);}});");
        return sb.toString();
    }

    private class Cleanup2 implements Runnable {

        private Thread thread;

        public Cleanup2() {
            GuarbageWatch.add(this);
            thread = new Thread(this);
        }

        @Override
        public void run() {
            StopWatch stopWatch = new StopWatch();
            while (Global.run) {
                try {
                    Thread.sleep(10000);
                } catch (InterruptedException ex) {
                    Logger.getLogger(ImageProcessing.class.getName()).log(Level.SEVERE, null, ex);
                }
                if (stopWatch.get_ms() > 14400) {
                    stopWatch.Reset();
                    File folder = new File(getTempFolder());
                    File[] listOfFiles = folder.listFiles();

                    for (File file : listOfFiles) {
                        if (file.isFile()) {
                            if (file.lastModified() - 86400000 > System.currentTimeMillis()) {
                                try {
                                    file.delete();
                                } catch (SecurityException ex) {

                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public static String getTempFolder() {
        File file = new File(System.getProperty("user.home") + File.separator + "Desktop" + File.separator + "UploadedImages" + File.separator);
        if (!file.exists()) {
            file.mkdir();
        }
        return file.getAbsolutePath();
    }

    public static BufferedImage scale(BufferedImage bufferedImage, int width, int height) {
        BufferedImage bufferedImageScaled = new BufferedImage(width, height, bufferedImage.getType());
        Graphics2D g = bufferedImageScaled.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(bufferedImage, 0, 0, width, height, 0, 0, bufferedImage.getWidth(), bufferedImage.getHeight(), null);
        g.dispose();
        return bufferedImageScaled;
    }

    public static BufferedImage crop(BufferedImage src, int x, int y, int width, int height) {
        if (src != null) {
            if (x < 0) {
                x = 0;
            }
            if (y < 0) {
                y = 0;
            }
            int wMax = src.getWidth() - x;
            int hMax = src.getHeight() - y;
            if (width > wMax) {
                width = wMax;
            }
            if (height > hMax) {
                height = hMax;
            }
            BufferedImage dest = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
            Graphics g = dest.getGraphics();
            g.drawImage(src, 0, 0, width, height, x, y, x + width, y + height, new Color(0f, 0f, 0f, .0f), null);
            g.dispose();
            return dest;
        }
        return null;
    }

    public static String save(BufferedImage bufferedImage) throws IOException {
        String folder = getTempFolder() + File.separator;
        return save(bufferedImage, folder);
    }

    public static String save(BufferedImage bufferedImage, String folder) throws IOException {
        File fileFolder = new File(folder);
        if (!fileFolder.exists()) {
            fileFolder.mkdir();
        }
        File downloads = new File(folder);
        if (!downloads.exists()) {
            downloads.mkdir();
        }
        String relativePath = generateRandomFileName(".png");
        File file = new File(folder + relativePath);
        ImageIO.write(bufferedImage, "png", file);
        return relativePath;
    }

    public static boolean delete(String relativePath) {
        return delete(relativePath, getTempFolder());
    }

    public static boolean delete(String relativePath, String folder) {
        File file = new File(folder + File.separator + relativePath);
        if (file.exists()) {
            return file.delete();
        }
        return true;
    }

    private static String generateRandomFileName(String surfix) {
        if (!surfix.contains(".")) {
            surfix = "." + surfix;
        }
        String str;
        while (true) {
            str = new SessionIdentifierGenerator().nextSessionId() + surfix;
            if (!new File(str).exists()) {
                break;
            }
        }
        return str;

    }

    private static String generateRandomFileNamePrefix(String surfix) {
        if (!surfix.contains(".")) {
            surfix = "." + surfix;
        }
        String str;
        while (true) {
            str = new SessionIdentifierGenerator().nextSessionId();
            if (!new File(str + surfix).exists()) {
                break;
            }
        }
        return str;

    }

    static boolean checkAspectRatio(BufferedImage bufferedImage, float i) {
        return (float) bufferedImage.getWidth() / (float) bufferedImage.getHeight() - i < 0.01;
    }

    private static final class SessionIdentifierGenerator {

        private SecureRandom random = new SecureRandom();

        public String nextSessionId() {
            return new BigInteger(130, random).toString(32);
        }
    }

    public static BufferedImage compress(BufferedImage image) {
        try {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ex) {
                Logger.getLogger(ImageProcessing.class.getName()).log(Level.SEVERE, null, ex);
            }
            File compressedImageFile = File.createTempFile(generateRandomFileNamePrefix("jpg"), ".jpg", null);
            compressedImageFile.deleteOnExit();
            OutputStream os = new FileOutputStream(compressedImageFile);
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
            ImageWriter writer = (ImageWriter) writers.next();
            ImageOutputStream ios = ImageIO.createImageOutputStream(os);
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(0.5f);
            String[] compressionTypes = param.getCompressionTypes();
            param.setCompressionType("JPEG");
            writer.write(null, new IIOImage(image, null, null), param);
            os.close();
            ios.close();
            writer.dispose();
            BufferedImage processedImage = ImageIO.read(compressedImageFile);
            BufferedImage processedImage2 = new BufferedImage(processedImage.getWidth(), processedImage.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
            processedImage2.getGraphics().drawImage(processedImage, 0, 0, null);
            return processedImage2;
        } catch (Exception ex) {
            Logger.getLogger(ImageProcessing.class.getName()).log(Level.SEVERE, null, ex);
            return image;
        }
    }

    public static class Logging {

        private static String path = System.getProperty("user.home") + "/Desktop/image_log.txt";
        static File file = new File(path);

        static {
            if (!file.exists()) {
                try {
                    file.createNewFile();
                } catch (IOException ex) {
                    Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        public static void log(String ip, String fileName) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss ");
                Files.write(Paths.get(path), (LocalDateTime.now().format(formatter) + ip + " " + fileName + "\r\n").getBytes(), StandardOpenOption.APPEND);
            } catch (IOException ex) {
                Logger.getLogger(Ip.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static String getFileNameSurfix(String fileName) {

        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            return fileName.substring(i + 1);
        }
        return null;
    }
}
