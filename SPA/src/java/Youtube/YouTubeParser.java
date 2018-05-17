package Youtube;

import MyWeb.Ajax.IPMode;
import MyWeb.GuarbageWatch;
import MyWeb.IGetHtml;
import MyWeb.MyConsole;
import MyWeb.PageNotFoundException;
import Youtube.Exceptions.AgeException;
import Youtube.Exceptions.PlayerException;
import Youtube.Exceptions.UrlEncodedFmtStreamException;
import Youtube.Exceptions.VideoUnavailablePlayer;
import Youtube.YouTubeInfo.AudioQuality;
import Youtube.YouTubeInfo.Container;
import Youtube.YouTubeInfo.Encoding;
import Youtube.YouTubeInfo.StreamAudio;
import Youtube.YouTubeInfo.StreamCombined;
import Youtube.YouTubeInfo.StreamInfo;
import Youtube.YouTubeInfo.StreamVideo;
import Youtube.YouTubeInfo.YoutubeQuality;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

public class YouTubeParser {

    private IGetHtml iGetHtml;

    public static class Return {

        public YouTubeInfo youtubeInfo;
        public CookieManager cookieManager;
        public Boolean skipTest;
        public Exception ex;
        public Boolean successful;

        public Return(YouTubeInfo youtubeInfo, CookieManager cookieManager, Boolean skipTest) {
            this.youtubeInfo = youtubeInfo;
            this.cookieManager = cookieManager;
            this.skipTest = skipTest;
            successful = true;
        }

        public Return(Exception ex) {
            this.ex = ex;
            successful = false;
        }
    }

    public YouTubeParser(IGetHtml iGetHtml) {
            GuarbageWatch.add(this);
        this.iGetHtml = iGetHtml;
    }

    public Return extract(URL urlRaw, AtomicBoolean stop, IProgress iProgress) throws MalformedURLException {
        String id = extractId(urlRaw);
        System.out.println(id);
        if (id == null) {
            throw new MalformedURLException();
        }
        String url = "https://www.youtube.com/watch?v=" + id;
        YouTubeInfo youtubeInfo = new YouTubeInfo(new URL(url), id);
        try {
            CookieManager cookieManager = new CookieManager();
            AtomicBoolean wasEmbedded = new AtomicBoolean(false);
            List<VideoDownload> videoDownloads = extractLinks(youtubeInfo, cookieManager, stop, wasEmbedded);
            if (videoDownloads.size() > 0) {
                List<VideoDownload> audioDownloads = new ArrayList<VideoDownload>();
                for (int i = videoDownloads.size() - 1; i >= 0; i--) {
                    VideoDownload videoDownload = videoDownloads.get(i);
                    if (videoDownload.stream == null) {
                        videoDownloads.remove(i);
                    } else if (StreamCombined.class.isAssignableFrom(videoDownload.stream.getClass())) {
                    } else if (StreamAudio.class.isAssignableFrom(videoDownload.stream.getClass())) {
                        audioDownloads.add(videoDownloads.remove(i));
                    } else {
                        videoDownloads.remove(i);
                    }

                }
                Collections.sort(videoDownloads, new VideoContentFirstComprator());
                Collections.sort(audioDownloads, new VideoContentFirstComprator());
                for (int i = 0; i < videoDownloads.size(); i++) {
                    VideoDownload videoDownload = videoDownloads.get(i);
                    VideoFileInfo videoFileInfo = new VideoFileInfo(videoDownload.url, videoDownload.stream);
                    youtubeInfo.addVideoFileInfo(videoFileInfo);
                }
                for (int i = 0; i < audioDownloads.size(); i++) {
                    VideoDownload audioDownload = audioDownloads.get(i);
                    VideoFileInfo videoFileInfo = new VideoFileInfo(audioDownload.url, audioDownload.stream);
                    youtubeInfo.addAudioFileInfo(videoFileInfo);
                }
                return new Return(youtubeInfo, cookieManager, wasEmbedded.get());
            }
        } catch (MalformedURLException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();

        }
        return null;
    }

    public List<VideoDownload> extractLinks(final YouTubeInfo info, CookieManager cookieManager, final AtomicBoolean stop, AtomicBoolean wasEmbedded) throws Exception {
        try {
            List<VideoDownload> sNextVideoURL = new ArrayList<VideoDownload>();
            while (true) {
                try {
                    wasEmbedded.set(false);
                    if (extractEmbedded(sNextVideoURL, info, cookieManager, stop)) {
                        wasEmbedded.set(true);
                        break;
                    }
                } catch (MalformedURLException ex) {
                    throw ex;
                } catch (DownloadError ex) {
                    ex.printStackTrace();
                }

                try {
                    streamCapture(sNextVideoURL, info, cookieManager, stop);
                    break;
                } catch (Exception e2) {
                    e2.printStackTrace();
                }
                break;
            }
            return sNextVideoURL;
        } catch (Exception e) {
            throw e;
        }
    }

    public void streamCapture(List<VideoDownload> sNextVideoURL, final YouTubeInfo info, CookieManager cookieManager, final AtomicBoolean stop) throws Exception {
        String html = iGetHtml.getHtml(info.getUrl(), cookieManager, true, stop, IPMode.IPv4Pref);//new DownloadInfo(info.getWeb()))
        extractHtmlInfo(sNextVideoURL, info, html, info.getUrl(), cookieManager, stop);
        extractIcon(info, html, info.getUrl());
    }

    private void getVideoInfo(YouTubeInfo info, CookieManager cookieManager, AtomicBoolean stop) throws MalformedURLException, PageNotFoundException, UnsupportedEncodingException {
        if (!info.getDidGetVideoInfo()) {
            String get = String.format("https://www.youtube.com/get_video_info?authuser=0&video_id=%s&el=embedded&ps=default&eurl=&hl=en_US", info.getId());
            URL url = new URL(get);
            String qs = iGetHtml.getHtml(url, cookieManager, false, stop, IPMode.Any);
            Map<String, String> map = qsToMap(qs);
            //for (String str : map.keySet()) {
             //   MyConsole.out.println(str + ":" + map.get(str));
            //}
            String title = String.format("https://www.youtube.com/watch?v=" + info.getId());
            String t = map.get("title");
            if (t != null) {
                title = t;
            }
            if (title != null) {
                info.setTitle(URLDecoder.decode(title, "UTF-8"));
            }
            String icon = map.get("thumbnail_url");
            if (icon != null) {
                icon = URLDecoder.decode(icon, "UTF-8");
                info.setIconUrl(new URL(icon));
            }
            String url_encoded_fmt_stream_map = map.get("url_encoded_fmt_stream_map");
            info.setUrlEncodedFmtStreamMap(url_encoded_fmt_stream_map);
            String status = map.get("status");
            info.setStatus(status);
            if (status != null) {
                if (url_encoded_fmt_stream_map != null && status.equals("ok")) {
                    String userCipherSignatureString = map.get("use_cipher_signature");
                    if (userCipherSignatureString != null) {
                        Boolean useCipherSignature = Boolean.parseBoolean(userCipherSignatureString);
                        info.setUseCypherSignature(useCipherSignature);
                    }
                }
            }
            info.setDidGetVideoInfo();
        }
    }

    public Boolean extractEmbedded(List<VideoDownload> sNextVideoURL, final YouTubeInfo info, CookieManager cookieManager, final AtomicBoolean stop) throws Exception {

        getVideoInfo(info, cookieManager, stop);
        if (info.getStatus() != null) {
            if (info.getStatus().toLowerCase().equals("ok")) {
                if (info.getUseCypherSignature() == false) {
                    extractUrlEncodedVideos(sNextVideoURL, info.getUrlEncodedFmtStreamMap(), info, cookieManager, stop, false, info.getTitle(), info.getPlayerURI());
                    return true;
                }
            }
        }
        return false;
    }

    public Boolean add(List<VideoDownload> sNextVideoURL, String itag, String url, String sig, String title, Boolean hasSig) throws IOException {
        if (url != null && itag != null && (!hasSig || sig != null)) {
            try {
                if (hasSig) {
                    url += "&signature=" + sig;
                }
                url += "&title=" + ((title == null) ? "video" : URLEncoder.encode(title));
                url = Pattern.compile("/[^\\/]+\\.googlevideo\\.com", Pattern.CASE_INSENSITIVE).matcher(url).replaceAll("redirector.googlevideo.com");
                Integer i = Integer.decode(itag);
                StreamInfo vd = itagMap.get(i);
                sNextVideoURL.add(new VideoDownload(vd, new URL(url)));
                return true;
            } catch (MalformedURLException e) {

            }
        }
        return false;
    }

    public static String getFinalURL(String url) throws IOException {
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
        con.setInstanceFollowRedirects(false);
        con.connect();
        con.getInputStream();
        int status = con.getResponseCode();
        if (status == HttpURLConnection.HTTP_MOVED_TEMP
                || status == HttpURLConnection.HTTP_MOVED_PERM
                || status == HttpURLConnection.HTTP_SEE_OTHER) {
            String redirectUrl = con.getHeaderField("Location");
            return getFinalURL(redirectUrl);
        }
        return url;
    }

    public static final Map<Integer, StreamInfo> itagMap = new HashMap<Integer, StreamInfo>() {
        private static final long serialVersionUID = -6925194111122038477L;

        {
            put(120, new StreamCombined(Container.FLV, Encoding.H264, YoutubeQuality.p720, Encoding.AAC,
                    AudioQuality.k128));
            put(102, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p720, Encoding.VORBIS,
                    AudioQuality.k192));
            put(101, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p360, Encoding.VORBIS,
                    AudioQuality.k192)); // webm
            put(100, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p360, Encoding.VORBIS,
                    AudioQuality.k128)); // webm
            put(85, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p1080, Encoding.AAC,
                    AudioQuality.k192)); // mp4
            put(84, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p720, Encoding.AAC,
                    AudioQuality.k192)); // mp4
            put(83, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p240, Encoding.AAC,
                    AudioQuality.k96)); // mp4
            put(82, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p360, Encoding.AAC,
                    AudioQuality.k96)); // mp4
            put(46, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p1080, Encoding.VORBIS,
                    AudioQuality.k192)); // webm
            put(45, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p720, Encoding.VORBIS,
                    AudioQuality.k192)); // webm
            put(44, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p480, Encoding.VORBIS,
                    AudioQuality.k128)); // webm
            put(43, new StreamCombined(Container.WEBM, Encoding.VP8, YoutubeQuality.p360, Encoding.VORBIS,
                    AudioQuality.k128)); // webm
            put(38, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p3072, Encoding.AAC,
                    AudioQuality.k192)); // mp4
            put(37, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p1080, Encoding.AAC,
                    AudioQuality.k192)); // mp4
            put(36, new StreamCombined(Container.GP3, Encoding.MP4, YoutubeQuality.p240, Encoding.AAC,
                    AudioQuality.k36)); // 3gp
            put(35, new StreamCombined(Container.FLV, Encoding.H264, YoutubeQuality.p480, Encoding.AAC,
                    AudioQuality.k128)); // flv
            put(34, new StreamCombined(Container.FLV, Encoding.H264, YoutubeQuality.p360, Encoding.AAC,
                    AudioQuality.k128)); // flv
            put(22, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p720, Encoding.AAC,
                    AudioQuality.k192)); // mp4
            put(18, new StreamCombined(Container.MP4, Encoding.H264, YoutubeQuality.p360, Encoding.AAC,
                    AudioQuality.k96)); // mp4
            put(17, new StreamCombined(Container.GP3, Encoding.MP4, YoutubeQuality.p144, Encoding.AAC,
                    AudioQuality.k24)); // 3gp
            put(6, new StreamCombined(Container.FLV, Encoding.H263, YoutubeQuality.p270, Encoding.MP3,
                    AudioQuality.k64)); // flv
            put(5, new StreamCombined(Container.FLV, Encoding.H263, YoutubeQuality.p240, Encoding.MP3,
                    AudioQuality.k64)); // flv

            put(133, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p240));
            put(134, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p360));
            put(135, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p480));
            put(136, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p720));
            put(137, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p1080));
            put(138, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p2160));
            put(160, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p144));
            put(242, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p240));
            put(243, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p360));
            put(244, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p480));
            put(247, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p720));
            put(248, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p1080));
            put(264, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p1440));
            put(271, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p1440));
            put(272, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p2160));
            put(278, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p144));
            put(298, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p720));
            put(299, new StreamVideo(Container.MP4, Encoding.H264, YoutubeQuality.p1080));
            put(302, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p720));
            put(303, new StreamVideo(Container.WEBM, Encoding.VP9, YoutubeQuality.p1080));

            put(139, new StreamAudio(Container.MP4, Encoding.AAC, AudioQuality.k48));
            put(140, new StreamAudio(Container.MP4, Encoding.AAC, AudioQuality.k128));
            put(141, new StreamAudio(Container.MP4, Encoding.AAC, AudioQuality.k256));
            put(171, new StreamAudio(Container.WEBM, Encoding.VORBIS, AudioQuality.k128));
            put(172, new StreamAudio(Container.WEBM, Encoding.VORBIS, AudioQuality.k192));

            put(249, new StreamAudio(Container.WEBM, Encoding.OPUS, AudioQuality.k50));
            put(250, new StreamAudio(Container.WEBM, Encoding.OPUS, AudioQuality.k70));
            put(251, new StreamAudio(Container.WEBM, Encoding.OPUS, AudioQuality.k160));
        }
    };

    public static String extractId(URL url) {

        System.out.println("extracting");
        Pattern u = Pattern.compile("^.*(youtu\\.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\&v=)([^#\\&\\?]*).*");
        Matcher um = u.matcher(url.toString());
        if (um.find()) {
            String id = um.group(2);
            System.out.println(id);
            if (id.length() == 11) {
                return id;
            }

        }

        return null;
    }

    public void extractIcon(VideoInfo info, String html, URL pageURL) throws MalformedURLException {
        try {
            Pattern pattern = Pattern.compile("itemprop=\"thumbnailUrl\" href=\"(.*)\"");
            Matcher titleMatch = pattern.matcher(html);
            if (titleMatch.find()) {
                String sline = titleMatch.group(1);
                sline = StringEscapeUtils.unescapeHtml4(sline);
                info.setIconUrl(new URL(sline));
            } else {
                pattern = Pattern.compile("\\\\\\\"iurl\\\\\\\"\\s*:\\s*\\\\\\\"([A-Za-z0-9-\\\\\\._:\\/]*)\\\\\\\""/*\\s*type=\\\"image\\/x-icon\\\">"*/);
                titleMatch = pattern.matcher(html);
                if (titleMatch.find()) {
                    String sline = titleMatch.group(1);
                    if (sline.length() > 2) {
                       //sline =( sline.substring(0, 2).equals("//") ? "http:" : pageURL.getProtocol() + "://" + pageURL.getHost())+sline;
                        info.setIconUrl(new URL(sline.replace("\\\\\\/","/")));
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, String> qsToMap(String qs) throws UnsupportedEncodingException {
        Map<String, String> res = new HashMap<String, String>();
        String[] pars = qs.split("&");

        for (String str : pars) {
            String[] kv = str.split("=");
            try {
                String k = kv[0];
                String v = kv[1];
                res.put(k, URLDecoder.decode(v, "UTF-8"));
            } catch (Exception ex) {

            }
        }
        return res;

    }

    private static class PlayerExtractionInfo {

        public enum Mode {

            ProtocolRelative, Relative, ProtocolRelativeEncoded
        };
        public Mode mode;
        public String pattern;

        public PlayerExtractionInfo(Mode mode, String pattern) {
            this.mode = mode;
            this.pattern = pattern;
        }
    }
    private static List<PlayerExtractionInfo> playerExtractionInfos = new ArrayList<PlayerExtractionInfo>() {
        {
            add(new PlayerExtractionInfo(PlayerExtractionInfo.Mode.ProtocolRelativeEncoded, "(\\\\\\\\\\\\\\/\\\\\\\\\\\\\\/[A-Za-z0-9_\\/.\\\\]+\\\\\\\\\\\\\\/player-[A-Za-z0-9-_]+\\\\\\\\\\\\\\/[A-Za-z0-9_-]+.js)"));
            add(new PlayerExtractionInfo(PlayerExtractionInfo.Mode.ProtocolRelative, "(//.*?/player-[\\w\\d\\-]+\\/.*\\.js)"));
            add(new PlayerExtractionInfo(PlayerExtractionInfo.Mode.Relative, "(/.*?/player-[\\w\\d\\-]+\\/.*\\.js)"));
        }
    };

    private URI getPlayer(String html, URL pageURL) throws URISyntaxException, PlayerException {
        ///yts/jsbin/player-en_GB-vfla1cBi5/base.js
        //old: 
        for (PlayerExtractionInfo playerExtractionInfo : playerExtractionInfos) {
            Pattern playerURL = Pattern.compile(playerExtractionInfo.pattern);
            Matcher playerVersionMatch = playerURL.matcher(html);
            String url;
            if (playerVersionMatch.find()) {
                String urlPrefix;
                if (playerExtractionInfo.mode.equals(PlayerExtractionInfo.Mode.ProtocolRelativeEncoded)) {
                    urlPrefix = "https:";
                    url = urlPrefix + playerVersionMatch.group(1).replace("\\\\\\/", "/");
                } else {
                    if (playerExtractionInfo.mode.equals(PlayerExtractionInfo.Mode.ProtocolRelative)) {
                        urlPrefix = "https:";
                    } else {
                        urlPrefix = pageURL.getProtocol() + "://" + pageURL.getHost();
                    }
                    url = urlPrefix + playerVersionMatch.group(1);
                }
                return new URI(url);
            }
        }
        throw new PlayerException("failed to get player");

    }

    private static class UrlEncodedFtpStreamExtractionInfo {

        public enum Mode {

            Normal, Escaped
        };
        public Mode mode;
        public String pattern;

        public UrlEncodedFtpStreamExtractionInfo(Mode mode, String pattern) {
            this.mode = mode;
            this.pattern = pattern;
        }
    }

    private static List<UrlEncodedFtpStreamExtractionInfo> urlEncodedFtpStreamExtractionInfos = new ArrayList<UrlEncodedFtpStreamExtractionInfo>() {
        {
            add(new UrlEncodedFtpStreamExtractionInfo(UrlEncodedFtpStreamExtractionInfo.Mode.Escaped, "\\\\\"url_encoded_fmt_stream_map\\\\\"[\\n\\r\\s]*:[\\n\\r\\s]*[\\n\\r\\s]*\\\\\"([^\\\"]*)\\\\\""));
            add(new UrlEncodedFtpStreamExtractionInfo(UrlEncodedFtpStreamExtractionInfo.Mode.Normal, "\"url_encoded_fmt_stream_map\":\"([^\"]*)\""));
        }
    };

    private String getUrlEncodedFmtStreamMap(String html) throws UrlEncodedFmtStreamException, UnsupportedEncodingException {

        for (UrlEncodedFtpStreamExtractionInfo urlEncodedFtpStreamExtractionInfo : urlEncodedFtpStreamExtractionInfos) {
            Pattern urlencod = Pattern.compile(urlEncodedFtpStreamExtractionInfo.pattern);
            Matcher urlencodMatch = urlencod.matcher(html);
            if (urlencodMatch.find()) {
                if (urlEncodedFtpStreamExtractionInfo.mode.equals(UrlEncodedFtpStreamExtractionInfo.Mode.Escaped)) {
                    String str = urlencodMatch.group(1).replace("\\\\", "\\");
                    return str;

                }
                return urlencodMatch.group(1);
            }
        }
        throw new UrlEncodedFmtStreamException("failed to get url_encoded_fmt_stream_map");

    }

    private static class AdaptiveFmtsExtractionInfo {

        public enum Mode {

            Normal, Escaped
        };
        public Mode mode;
        public String pattern;

        public AdaptiveFmtsExtractionInfo(Mode mode, String pattern) {
            this.mode = mode;
            this.pattern = pattern;
        }
    }
    private static List<AdaptiveFmtsExtractionInfo> adaptiveFmtsExtractionInfos = new ArrayList<AdaptiveFmtsExtractionInfo>() {
        {
            add(new AdaptiveFmtsExtractionInfo(AdaptiveFmtsExtractionInfo.Mode.Escaped, "\\\\\"adaptive_fmts\\\\\"[\\n\\r\\s]*:[\\n\\r\\s]*[\\n\\r\\s]*\\\\\"([^\\\"]*)\\\\\""));
            add(new AdaptiveFmtsExtractionInfo(AdaptiveFmtsExtractionInfo.Mode.Normal, "\"adaptive_fmts\":\\s*\"([^\"]*)\""));
        }
    };

    private String getAdaptiveFmts(String html) throws UrlEncodedFmtStreamException, UnsupportedEncodingException {

//\\"url_encoded_fmt_stream_map\\"[\n]*:[\n]*\\"([^\"]*)\\"
        for (AdaptiveFmtsExtractionInfo adaptiveFmtsExtractionInfo : adaptiveFmtsExtractionInfos) {
            Pattern urlencod = Pattern.compile(adaptiveFmtsExtractionInfo.pattern);
            Matcher urlencodMatch = urlencod.matcher(html);
            if (urlencodMatch.find()) {
                if (adaptiveFmtsExtractionInfo.mode.equals(AdaptiveFmtsExtractionInfo.Mode.Escaped)) {
                    String str = urlencodMatch.group(1).replace("\\\\", "\\");
                    return str;
                }
                return urlencodMatch.group(1);
            }
        }
        throw new UrlEncodedFmtStreamException("failed to get url_encoded_fmt_stream_map");
    }

    private String getTitle(String html) throws UnsupportedEncodingException {
        Pattern patternTitle = Pattern.compile("<meta name=\"title\" content=(.*)");
        Matcher matcherTitle = patternTitle.matcher(html);
        if (matcherTitle.find()) {
            String sline = matcherTitle.group(1);
            String title = sline.replaceFirst("<meta name=\"title\" content=", "").trim();
            title = StringUtils.strip(title, "\">");
            return StringEscapeUtils.unescapeHtml4(title);
        } else {
            patternTitle = Pattern.compile("\\\\\"video\\\\\":\\s*\\{.*?\\\\\\\"title\\\\\\\":\\s*\\\\\\\"(.*?)\\\\\\\"");
            matcherTitle = patternTitle.matcher(html);
            if (matcherTitle.find()) {
                return URLDecoder.decode(matcherTitle.group(1).replace("\\\\", ""),"UTF-8");
            }
        }
        return null;
    }

    public void extractHtmlInfo(List<VideoDownload> sNextVideoURL, YouTubeInfo info, String html, URL pageURL, CookieManager cookieManager, AtomicBoolean stop) throws Exception {

        String title = getTitle(html);
        if (title != null) {
            info.setTitle(title);
        }
        {
            Pattern age = Pattern.compile("(verify_age)");
            Matcher ageMatch = age.matcher(html);
            if (ageMatch.find()) {
                throw new AgeException();
            }
        }
        {
            Pattern age = Pattern.compile("(unavailable-player)");
            Matcher ageMatch = age.matcher(html);
            if (ageMatch.find()) {
                throw new VideoUnavailablePlayer();
            }
        }
        // grab html5 player url
        URI playerUri = getPlayer(html, pageURL);
        info.setPlayerURI(playerUri);

        String url_encoded_fmt_stream_map = getUrlEncodedFmtStreamMap(html);
//\\"url_encoded_fmt_stream_map\\"[\n]*:[\n]*\\"([^\"]*)\\"
        if (url_encoded_fmt_stream_map != null) {
            extractUrlEncodedVideos(sNextVideoURL, url_encoded_fmt_stream_map, info, cookieManager, stop, true, title, playerUri);
        }
        String adaptive_fmts = getAdaptiveFmts(html);
        if (adaptive_fmts != null) {
            extractUrlEncodedVideos(sNextVideoURL, adaptive_fmts, info, cookieManager, stop, true, title, playerUri);
        }
    }

    private String getSigFromMap(Map<String, String> map) {

        String sig = map.get("s");
        if (sig == null) {
            sig = map.get("signature");
            if (sig == null) {
                sig = map.get("sig");
            }
        }
        return sig;
    }

    public void extractUrlEncodedVideos(List<VideoDownload> sNextVideoURL, String url_encoded_fmt_stream_map, YouTubeInfo info, CookieManager cookieManager, AtomicBoolean stop, Boolean hasSig, String title, URI playerUri) throws Exception {
        String[] tmps = url_encoded_fmt_stream_map.split(",");
        List<Map<String, String>> urlEncodedFmtStreamMap = new ArrayList<Map<String, String>>();
        for (String str : tmps) {
            str = str.replace("\\u0026", "&");
            urlEncodedFmtStreamMap.add(qsToMap(str));
            //Map<String, String> s = qsToMap(str);
            //for (String key : s.keySet()) {
            //    System.out.println("key: " + key + " :  value: " + s.get(key));
            //}
        }
        DecryptSignatureHtml5 ss = new DecryptSignatureHtml5(cookieManager, playerUri, iGetHtml);
        for (Map<String, String> map2 : urlEncodedFmtStreamMap) {
            String url = map2.get("url");
            String itag = map2.get("itag");
            String sig = getSigFromMap(map2);
            if (hasSig && sig != null) {
                sig = ss.decrypt(stop, sig);
            }
            add(sNextVideoURL, itag, url, sig, title, hasSig);
        }
    }
}
