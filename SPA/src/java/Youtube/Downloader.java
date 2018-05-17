package Youtube;

import MyWeb.DownloaderHtml;
import MyWeb.Ajax;
import MyWeb.GuarbageWatch;
import MyWeb.MyConsole;
import MyWeb.StopWatch;
import Youtube.YouTubeInfo.StreamAudio;
import Youtube.YouTubeInfo.StreamCombined;
import Youtube.YouTubeInfo.StreamInfo;
import java.net.HttpCookie;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 *
 * @author SoftwareEngineer
 */
public class Downloader implements Runnable {

    private final Boolean allowProxy = false;
    private Boolean skipEmbedded = false;
    private AtomicBoolean done = new AtomicBoolean(false);
    private StopWatch stopWatchSinceStart = new StopWatch();
    private final int N_TRIES_DIRECT = 5;
    private final int TIMEOUT_TRY_INDIRECT = 10;

    private DownloaderHtml downloaderHtml = new DownloaderHtml(allowProxy, true);
    private volatile String html;
    private String url;
    private IDownloader iDownloader;
    private IAudioFileInfoBuffer iAudioFileInfoBuffer;
    public Downloader()
    {
        
            GuarbageWatch.add(this);
    }

    private void reset() {
        skipEmbedded = false;
        done.set(false);
        stopWatchSinceStart.Reset();
    }

    public void getLinks(String url, IDownloader iDownloader, IAudioFileInfoBuffer iAudioFileInfoBuffer) {
        this.skipEmbedded = false;
        this.iAudioFileInfoBuffer = iAudioFileInfoBuffer;
        url = url.replaceAll("\\s", "");
        this.url = url;
        this.iDownloader = iDownloader;
        reset();
        iDownloader.progress("acquiring the video's sources...");
        new Thread(this).run();
    }

    public void retry() {
        this.skipEmbedded = true;
        iDownloader.progress("acquiring other video sources...");
        new Thread(this).run();
    }

    private LinkInfo getBestAudio(List<LinkInfo> listAudios) {
        LinkInfo bestLinkInfo = null;
        int bestLinkInfoQuality = 0;
        for (LinkInfo linkInfo : listAudios) {
            if (bestLinkInfo == null) {
                bestLinkInfo = linkInfo;
                bestLinkInfoQuality = linkInfo.getAudioQualityInt();
            } else {
                int linkInfoQuality = linkInfo.getAudioQualityInt();
                if (linkInfoQuality > bestLinkInfoQuality) {
                    bestLinkInfoQuality = linkInfoQuality;
                    bestLinkInfo = linkInfo;
                }
            }
        }
        return bestLinkInfo;
    }

    private List<LinkInfo> getAudioLinkInfos(LinkInfo linkInfo, String title) {
        List<LinkInfo> linkInfos = new ArrayList<LinkInfo>();
        if (linkInfo != null) {
            String[] containers = {"mp3", "avi", "wav"};
            for (String container : containers) {
                LinkInfo newLinkInfo = new LinkInfo("ServletYoutubeAudio?ident=" + AudioFileInfoBuffer.add(linkInfo.url, title, container, iAudioFileInfoBuffer), container, "", "");
                linkInfos.add(newLinkInfo);
            }
        }
        return linkInfos;
    }

    @Override
    public void run() {
        YouTubeParser youtubeParser = new YouTubeParser(downloaderHtml);
        List<LinkInfo> listVideos = new ArrayList<LinkInfo>();
        List<LinkInfo> listAudios = new ArrayList<LinkInfo>();
        IProgress iProgress = new IProgress() {
            @Override
            public void progress(String message) {
                iDownloader.progress(message);
            }
        };
        int tries = 0;
        while (true) {
            try {
                YouTubeParser.Return returns = youtubeParser.extract(new URL(url), done, iProgress);
                List<String> cookies = new ArrayList<String>();
                for (HttpCookie cookie : returns.cookieManager.getCookieStore().getCookies()) {
                    cookies.add(cookie.toString());
                }
                if (returns.youtubeInfo.getVideoFileInfos() != null) {
                    for (VideoFileInfo videoFileInfo : returns.youtubeInfo.getVideoFileInfos()) {
                        StreamInfo streamInfo = videoFileInfo.streamInfo;
                        String container = streamInfo.container.toString().toLowerCase();
                        StreamCombined streamCombined = (StreamCombined) streamInfo;
                        listVideos.add(new LinkInfo(videoFileInfo.getSource().toString(), container, streamCombined.youtubeQuality.toString(), streamCombined.videoEncoding.toString()));

                    }
                    for (VideoFileInfo videoFileInfo : returns.youtubeInfo.getAudioFileInfos()) {
                        StreamInfo streamInfo = videoFileInfo.streamInfo;
                        String container = streamInfo.container.toString().toLowerCase();
                        StreamAudio streamAudio = (StreamAudio) streamInfo;
                        listAudios.add(new LinkInfo(videoFileInfo.getSource().toString(), container, streamAudio.audioQuality.toString(), streamAudio.encoding.toString()));

                    }
                    MyConsole.out.println("icon is: " + returns.youtubeInfo.getIconUrl());
                    LinkInfo bestAudio = getBestAudio(listAudios);
                    listAudios = getAudioLinkInfos(bestAudio, returns.youtubeInfo.getTitle());
                    iDownloader.done(listVideos, listAudios, cookies, returns.youtubeInfo.getTitle(), returns.youtubeInfo.getIconUrl() != null ? returns.youtubeInfo.getIconUrl().toString() : null);
                    return;

                }
            } catch (MalformedURLException ex) {
                iDownloader.failed("You must enter a valid URL!");
                break;
            } catch (Exception ex) {
                if(tries>1)
                    break;
                tries++;
            } finally {
            }
        }
        iDownloader.failed();
    }
}
