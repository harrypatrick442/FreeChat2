package Youtube;

import MyWeb.GuarbageWatch;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang.NotImplementedException;

public class VideoInfo {

    private URL url;
    private String title;
    private URL iconUrl;
    private List<VideoFileInfo> videoFileInfos = new ArrayList<VideoFileInfo>();
    private List<VideoFileInfo> audioFileInfos = new ArrayList<VideoFileInfo>();

    public VideoInfo(URL url) {
            GuarbageWatch.add(this);
        this.url = url;
    }

    synchronized public String getTitle() {
        return title;
    }

    synchronized public void setTitle(String title) {
        this.title = title;
    }

    synchronized public URL getUrl() {
        return url;
    }

    synchronized public void setUrl(URL url) {
        this.url = url;
    }

    synchronized public URL getIconUrl() {
        return iconUrl;
    }

    synchronized public void setIconUrl(URL iconUrl) {
        this.iconUrl = iconUrl;
    }

    synchronized public URL getSourceUrl() {
        throw new NotImplementedException();
    }

    public void addVideoFileInfo(VideoFileInfo videoFileInfo) {
        videoFileInfos.add(videoFileInfo);
    }

    public List<VideoFileInfo> getVideoFileInfos() {
        return videoFileInfos;
    }

    public void addAudioFileInfo(VideoFileInfo videoFileInfo) {
            audioFileInfos.add(videoFileInfo);
    }

    public List<VideoFileInfo> getAudioFileInfos() {
        return audioFileInfos;
    }

}
