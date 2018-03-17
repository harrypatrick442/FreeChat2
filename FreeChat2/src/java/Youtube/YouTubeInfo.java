package Youtube;

import MyWeb.GuarbageWatch;
import java.net.URI;
import java.net.URL;

public class YouTubeInfo extends VideoInfo {

    private String status;
    private boolean useCypherSignature = false;
    private String urlEncodedFmtStreamMap;
    private boolean didGetVideoInfo = false;

    public enum YoutubeQuality {

        p3072, p2304, p2160, p1440, p1080, p720, p520, p480, p360, p270, p240, p224, p144;

        @Override
        public String toString() {
            return super.toString().replace("p", "") + "p";
        }
    }

    public enum Container {

        FLV, GP3, MP4, WEBM
    }

    public enum Encoding {

        H263, H264, VP8, VP9, MP4, MP3, AAC, VORBIS, OPUS
    }

    public enum AudioQuality {

        k256, k192, k160, k128, k96, k70, k64, k50, k48, k36, k24;

        @Override
        public String toString() {
            return super.toString().replace("k", "") + "k";
        }
    }

    public static class StreamInfo {

        public Container container;

        public StreamInfo() {
        }

        public StreamInfo(Container container) {
            this.container = container;
        }

        public String toString() {
            return container.toString();
        }
    }

    public static class StreamCombined extends StreamInfo {

        public Encoding videoEncoding;
        public YoutubeQuality youtubeQuality;
        public Encoding audioEncoding;
        public AudioQuality audioQuality;

        public StreamCombined() {
        }

        public StreamCombined(Container container, Encoding videoEncoding, YoutubeQuality youtubeQuality, Encoding audioEncoding, AudioQuality audioQuality) {
            super(container);

            this.videoEncoding = videoEncoding;
            this.youtubeQuality = youtubeQuality;
            this.audioEncoding = audioEncoding;
            this.audioQuality = audioQuality;
        }

        public String toString() {
            return container.toString() + " " + videoEncoding.toString() + "(" + youtubeQuality.toString() + ") " + audioEncoding.toString() + "("
                    + audioQuality.toString() + ")";
        }
    }

    public static class StreamVideo extends StreamInfo {

        public Encoding encoding;
        public YoutubeQuality youtubeQuality;

        public StreamVideo() {
        }

        public StreamVideo(Container container, Encoding encoding, YoutubeQuality youtubeQuality) {
            super(container);

            this.youtubeQuality = youtubeQuality;
            this.encoding = encoding;
        }

        public String toString() {
            return container.toString() + " " + encoding.toString() + "(" + youtubeQuality.toString() + ")";
        }
    }

    public static class StreamAudio extends StreamInfo {

        public Encoding encoding;
        public AudioQuality audioQuality;

        public StreamAudio() {
        }

        public StreamAudio(Container container, Encoding encoding, AudioQuality audioQuality) {
            super(container);
            this.encoding = encoding;
            this.audioQuality = audioQuality;
        }

        public String toString() {
            return container.toString() + " " + encoding.toString() + " " + audioQuality.toString();
        }
    }

    private URI playerURI;
    private String id;

    public YouTubeInfo(URL url, String id) {
        super(url);
            GuarbageWatch.add(this);
        this.id = id;
    }

    public URI getPlayerURI() {
        return playerURI;
    }

    public void setPlayerURI(URI playerURI) {
        if (playerURI != null) {
            this.playerURI = playerURI;
        }
    }

    public String getId() {
        return id;
    }

    public boolean getUseCypherSignature() {
        return useCypherSignature;
    }

    public void setUseCypherSignature(Boolean useCypherSignature) {
        this.useCypherSignature = useCypherSignature;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setUrlEncodedFmtStreamMap(String urlEncodedFmtStreamMap) {
        this.urlEncodedFmtStreamMap = urlEncodedFmtStreamMap;
    }

    public String getUrlEncodedFmtStreamMap() {
        return urlEncodedFmtStreamMap;
    }

    public boolean getDidGetVideoInfo() {
        return didGetVideoInfo;
    }

    public void setDidGetVideoInfo() {
        didGetVideoInfo = true;
    }
}
