/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

import MyWeb.GuarbageWatch;
import Youtube.YouTubeInfo.YoutubeQuality;

/**
 *
 * @author SoftwareEngineer
 */
public class LinkInfo {

    public String url;
    public String quality;
    public String encoding;
    public String container;

    public LinkInfo(String url, String container, String quality, String encoding) {
            GuarbageWatch.add(this);
        this.url = url;
        this.encoding = encoding;
        this.quality = quality;
        this.container = container;
    }

    public int getAudioQualityInt() {
        return Integer.parseInt(quality.replace("k", ""));
    }
}
