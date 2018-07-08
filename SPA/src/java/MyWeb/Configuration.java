package MyWeb;

import MySocket.AsynchronousSender;
import MySocket.IGetInterpreter;
import MySocket.MySocket;
import FreeChat2.InterpreterRoom;
import FreeChat2.Room;
import FreeChat2.RoomType;
import FreeChat2.Wall;
import MySocket.Enums;
import MySocket.MySocketInstances;
import Profiles.IConfigurationPassword;
import Profiles.InterpreterProfiles;
import Youtube.InterpreterDownloader;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
    
public class Configuration implements InterfaceConfiguration, IConfigurationPassword {
    public static int ROOM_NAME_LENGTH_MAX=30;
    public final static int ROOM_NAME_LENGTH_MIN=3;
    public final static int MAX_LENGTH_USERNAME=20;
    public final static int MIN_LENGTH_USERNAME=2;
    public final static int LENGTH_PASSWORD_MAX = 40;
    public final static int LENGTH_PASSWORD_MIN = 10;
    public final static String PM_PREFIX="PM with: ";
  
    public enum PageType {

        All, Video, Swingers
    }
    public static PageType pageType = PageType.All;
    public final static boolean consoleEnabled = true;
    private final static int passwordNSpecialMin = 1;
    private final static int passwordNCapitalMin = 1;
    public static boolean videoEnabled = true;
    public static boolean wallsEnabled = false;
    public static boolean obfuscate = false;
    public static boolean debugging = true;
    public static String remoteMachine = "http://chatdimension.com";
    public static int timeoutMs = 120000;
    public static int longPollingDelayMax = 55000;
    public static boolean allowRude = true;
    public static boolean useAjax = false;
    public static boolean isCors = false;
    public static boolean isPersistent = false;
    public static String pageUrl = "http://chatdimension.com";
    public static String pageUrlDeveloping = "http://localhost/FreeChat2";
    public static Boolean isOnServer = false;
    static{
       int l = MAX_LENGTH_USERNAME+PM_PREFIX.length();
       if(ROOM_NAME_LENGTH_MAX<l)
           ROOM_NAME_LENGTH_MAX=l;
    }

    public static void initialize() {
        
    }

    static {
        MySocketInstances.getInstance().setIGetInterpreter(new IGetInterpreter() {
            @Override
            public Interpreter getInstance(MySocket mySocket, String className, String name, Enums.Type type) {
                if (className.equals("chat_lobby")) {
                    return new FreeChat2.InterpreterLobby(new AsynchronousSender(mySocket, name), mySocket);
                }
                if (className.equals("chat_room")) {
                    return new InterpreterRoom(new AsynchronousSender(mySocket, name), mySocket);
                }
                if (className.equals("swingers_lobby")) {
                    return new FreeSwing.InterpreterLobby(new AsynchronousSender(mySocket, name));
                }
                if (className.equals("profiles")) {
                    return new InterpreterProfiles(new AsynchronousSender(mySocket, name), mySocket);
                }
                if (className.equals("video_downloader")) {
                    return new InterpreterDownloader(new AsynchronousSender(mySocket, name));
                }
                if (className.equals("test")) {
                    return new InterpreterTest(new AsynchronousSender(mySocket, name));
                }
                return null;
            }
        });
    }

    public static enum AuthenticationType {

        none, username, full
    };
    public static AuthenticationType authenticationType = AuthenticationType.full;

    public static List<String> getStylesToLoad() {
        List<String> list = new ArrayList<String>();
        addRange(list, new String[]{
            "styles/spinner.css"
        });
        return list;
    }

    public List<String> getJsFolders() {
        List<String> list = new ArrayList<String>();
        addRange(list, new String[]{
            "/javascript",
            "/javascript/FreeSwing",
            "/javascript/MySocket",
            "/javascript/MyWeb",
            "/javascript/VideoDownloader",
            "/javascript/Youtube"});
        return list;
    }

    public static String getJsString(Boolean isMobile, String pageType) throws FileNotFoundException, UnsupportedEncodingException {
        StringBuffer sb = new StringBuffer();
        sb.append("var Configuration={};");
        sb.append("Configuration.debugging=");
        sb.append(Configuration.debugging);
        sb.append(";");
        sb.append("Configuration.ajaxTimeout=");
        sb.append(Configuration.timeoutMs);
        sb.append(";");
        sb.append("Configuration.authenticationType='");
        sb.append(authenticationType.equals(AuthenticationType.username) ? "username" : (authenticationType.equals(AuthenticationType.none) ? "none" : "full"));
        sb.append("';");
        sb.append("Configuration.isPersistent=");
        sb.append(Configuration.isPersistent);
        sb.append(";");
        sb.append("if(!window.isCors)Configuration.videoEnabled=");
        sb.append(Configuration.videoEnabled);
        sb.append(";");
        sb.append("Configuration.wallsEnabled=");
        sb.append(Configuration.wallsEnabled);
        sb.append(";");
        sb.append("Configuration.allowRude=");
        sb.append(Configuration.allowRude);
        sb.append(";");
        sb.append("if(window.isCors==undefined)window.isCors=false;");
        //sb.append("if(!window.thePageUrl)");
        sb.append("Configuration.emoticonsXmlString = \"");
        Xml.getEscapedFileContentForJavaScript(FoldersHelper.getSrcXml()+"/emoticons.xml", sb);
        sb.append("\";Configuration.radioChannelsXmlString = \"");
        Xml.getEscapedFileContentForJavaScript(FoldersHelper.getSrcXml()+"/channels.xml", sb);
        sb.append("\";");
        sb.append("Configuration.pageType='");
        sb.append(pageType);
        sb.append("';");
        sb.append("Configuration.ENDPOINT_TYPE =");
        sb.append(useAjax ? "  MySocket.Type.AJAX;" : "MySocket.Type.WebSocket;");
        sb.append("Configuration.forcedImports=[pickupElseCreateElement];");
        if (pageType.contains("video")) {
        } else {
            sb.append("window.lobbiesToLoad=[];");
            if (pageType.contains("all")) {
                sb.append("window.lobbiesToLoad.push(LobbyChat);");
            }
            sb.append("window.lobbiesToLoad.push(LobbySwingers);");
        }
        return sb.toString();
    }

    private static void addRange(List<String> list, String[] range) {
        for (int i = 0; i < range.length; i++) {
            list.add(range[i]);
        }
    }
    public static Map<String, RoomType> defaultRooms = new LinkedHashMap<String, RoomType>();

    static {
        defaultRooms.put("Main", RoomType.Text);
        defaultRooms.put("Lounge", RoomType.Text);
       // if (videoEnabled) {
            //defaultRooms.put("Main Video", new Tuple<RoomType, Boolean>(RoomType.VideoStatic, false));
       // }
    }
    
    /*
    public static Map<String, Wall.Type> defaultWalls = new LinkedHashMap<String, Wall.Type>();

    static {
        defaultWalls.put("Main", Wall.Type.Static);
        defaultWalls.put("Porn", Wall.Type.Static);
        defaultWalls.put("Movies", Wall.Type.Static);
    }
*/
    
    public static InterfaceConfiguration getInterface() {
        return new Configuration();
    }

    public static String getDescription() {

        switch (pageType) {
            case Video:
                return "YouTube downloader to save your favourite youtube videos and playlist as mp3, mp4 or other formats.";
            case Swingers:
                return "Unique fuck finder swingers site with desktop design!";
        }
        return "";//Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!";

    }

    public static String getFavicon() {

        switch (pageType) {
            case Video:
                return "icons/mr_video_smoking.ico";
            case Swingers:
                return "";
        }
        return "";//Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!";

    }

    public static String getTitle() {

        switch (pageType) {
            case Video:
                return "Free YouTube downloader!";//UA-91656815-1
            case Swingers:
                return "";
        }
        return "";//Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!";

    }

    public static String getAnalyticsTrackingId() {

        switch (pageType) {
            case Video:
                return "UA-91656815-1";
            case Swingers:
                return "";
        }
        return "";//Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!";

    }
//grabavid-20
    public static String getAddSenseScripts() {

        switch (pageType) {
            case Video:
                return "<script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n"
                        + "<script>\n"
                        + "  (adsbygoogle = window.adsbygoogle || []).push({\n"
                        + "    google_ad_client: \"ca-pub-2932497279539980\",\n"
                        + "    enable_page_level_ads: true\n"
                        + "  });\n"
                        + "</script>";
            case Swingers:
                return "";
        }
        return "";//Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!";

    }

    @Override
    public String getPageUrl(Boolean isDevelopmentMachine) {
        if (isDevelopmentMachine) {
            return pageUrlDeveloping;
        }
        return pageUrl;
    }

    @Override
    public List<String> getJsFilePathsToIgnore(String pageType) {
        List<String> list = new ArrayList<String>();
        addRange(list, new String[]{"/javascript/MyWeb/is_mobile.js"});
        return list;
    }

    @Override
    public int getPasswordLengthMax() {
        return LENGTH_PASSWORD_MAX;
    }

    @Override
    public int getPasswordLengthMin() {
        return LENGTH_PASSWORD_MIN;
    }

    @Override
    public int getPasswordNSpecialMin() {
        return passwordNSpecialMin;
    }

    @Override
    public int getPasswordNCapitalMin() {
        return passwordNCapitalMin;
    }
}
