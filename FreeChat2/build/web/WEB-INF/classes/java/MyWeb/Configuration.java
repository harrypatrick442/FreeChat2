package MyWeb;

import MySocket.AsynchronousSender;
import MySocket.IGetInterpreter;
import MySocket.MySocket;
import FreeChat2.InterpreterRoom;
import FreeChat2.Room;
import FreeChat2.Wall;
import MySocket.Enums;
import Profiles.IConfigurationPassword;
import Profiles.InterpreterProfiles;
import Youtube.InterpreterDownloader;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Configuration implements InterfaceConfiguration, IConfigurationPassword {

    public enum PageType {

        All, Video, Swingers
    }
    public static PageType pageType = PageType.Video;
    public final static boolean consoleEnabled = false;
    private final static int passwordLengthMax = 10;
    private final static int passwordLengthMin = 10;
    private final static int passwordNSpecialMin = 1;
    private final static int passwordNCapitalMin = 1;
    public static boolean videoEnabled = true;
    public static boolean wallsEnabled = false;
    public static boolean obfuscate = false;
    public static boolean debugging = false;
    public static String remoteMachine = "http://chatdimension.com";
    public static int timeoutMs = 120000;
    public static int longPollingDelayMax = 55000;
    public static boolean allowRude = true;
    public static boolean useAjax = true;
    public static boolean isCors = false;
    public static boolean isPersistent = false;
    public static String pageUrl = "http://chatdimension.com";
    public static String pageUrlDeveloping = "http://localhost/FreeChat2";
    public static Boolean isOnServer = true;

    public static void initialize() {

    }

    static {
        MySocket.setIGetInterpreter(new IGetInterpreter() {
            @Override
            public Interpreter getInstance(MySocket mySocket, String className, String name, Enums.Type type) {
                if (className.equals("chat_lobby")) {
                    return new FreeChat2.InterpreterLobby(new AsynchronousSender(mySocket, name, type), mySocket);
                }
                if (className.equals("chat_room")) {
                    return new InterpreterRoom(new AsynchronousSender(mySocket, name, type), mySocket);
                }
                if (className.equals("swingers_lobby")) {
                    return new FreeSwing.InterpreterLobby(new AsynchronousSender(mySocket, name, type));
                }
                if (className.equals("profiles")) {
                    return new InterpreterProfiles(new AsynchronousSender(mySocket, name, type), mySocket);
                }
                if (className.equals("video_downloader")) {
                    return new InterpreterDownloader(new AsynchronousSender(mySocket, name, type));
                }
                if (className.equals("test")) {
                    return new InterpreterTest(new AsynchronousSender(mySocket, name, type));
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

    public List<String> getJsPackages() {
        List<String> list = new ArrayList<String>();
        addRange(list, new String[]{
            "/MyWeb/scripts/",
            "/MySocket/scripts/",
            "/FreeSwing/scripts/",
            "/FreeChat2/scripts/",
            "/VideoDownloader/scripts/",
            "/Youtube/scripts/"});
        return list;
    }

    public static String getJsString(Boolean isMobile, String pageType) {
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
        Xml.getEscapedFileContentForJavaScript("/FreeChat2/emoticons/emoticons.xml", sb);
        sb.append("\";Configuration.radioChannelsXmlString = \"");
        Xml.getEscapedFileContentForJavaScript("/FreeChat2/radio/channels.xml", sb);
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
            if (pageType.contains("All")) {
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
    public static Map<String, Tuple<Room.Type, Boolean>> defaultRooms = new LinkedHashMap<String, Tuple<Room.Type, Boolean>>();

    static {
        defaultRooms.put("Main", new Tuple<Room.Type, Boolean>(Room.Type.Static, true));
        defaultRooms.put("Lounge", new Tuple<Room.Type, Boolean>(Room.Type.Static, false));
        if (videoEnabled) {
            defaultRooms.put("Main Video", new Tuple<Room.Type, Boolean>(Room.Type.VideoStatic, false));
        }
    }
    public static Map<String, Wall.Type> defaultWalls = new LinkedHashMap<String, Wall.Type>();

    static {
        defaultWalls.put("Main", Wall.Type.Static);
        defaultWalls.put("Porn", Wall.Type.Static);
        defaultWalls.put("Movies", Wall.Type.Static);
    }

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
        addRange(list, new String[]{"/MyWeb/scripts/is_mobile.js"});
        return list;
    }

    @Override
    public int getPasswordLengthMax() {
        return passwordLengthMax;
    }

    @Override
    public int getPasswordLengthMin() {
        return passwordLengthMin;
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
