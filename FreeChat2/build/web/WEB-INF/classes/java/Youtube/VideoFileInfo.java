package Youtube;

import MyWeb.GuarbageWatch;
import MyWeb.MyConsole;
import Youtube.YouTubeInfo.StreamInfo;
import java.io.File;
import java.net.URL;

public class VideoFileInfo {

    private static final long serialVersionUID = -6921646534817186218L;

    public File targetFile;
    public StreamInfo streamInfo;
    public URL source;

    public VideoFileInfo(URL source, StreamInfo si) {
            GuarbageWatch.add(this);
        this.source = source;
        this.streamInfo = si;
    }

    /* public VideoFileInfo(URL source, ProxyInfo p) {
     super(source, p);
     }
     */
    /**
     * set target file download for current DownloadInfo
     *
     * @param file
     */
    public void setTarget(File file) {
        targetFile = file;
    }

    public URL getSource() {
        MyConsole.out.println("xxx may not be right added this.");
        return source;
    }

    public File getTarget() {
        return targetFile;
    }
}
