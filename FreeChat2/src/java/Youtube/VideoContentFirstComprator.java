/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

import java.util.Comparator;

/**
 *
 * @author SoftwareEngineer
 */
public class VideoContentFirstComprator implements Comparator<VideoDownload> {

    int ordinal(VideoDownload o1) {
        if (o1.stream instanceof YouTubeInfo.StreamCombined) {
            YouTubeInfo.StreamCombined c1 = (YouTubeInfo.StreamCombined) o1.stream;
            return c1.youtubeQuality.ordinal();
        }
        if (o1.stream instanceof YouTubeInfo.StreamVideo) {
            YouTubeInfo.StreamVideo c1 = (YouTubeInfo.StreamVideo) o1.stream;
            return c1.youtubeQuality.ordinal();
        }
        if (o1.stream instanceof YouTubeInfo.StreamAudio) {
            YouTubeInfo.StreamAudio c1 = (YouTubeInfo.StreamAudio) o1.stream;
            return c1.audioQuality.ordinal();
        }
        throw new RuntimeException("bad video array type");
    }
    @Override
    public int compare(VideoDownload o1, VideoDownload o2) {
        Integer i1 = ordinal(o1);
        Integer i2 = ordinal(o2);
        Integer ic = i1.compareTo(i2);

        return ic;
    }

}
