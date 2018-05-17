/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package Youtube;

import MyWeb.GuarbageWatch;
import java.net.URL;

/**
 *
 * @author SoftwareEngineer
 */
public class VideoDownload {

        public YouTubeInfo.StreamInfo stream;
        public URL url;

        public VideoDownload(YouTubeInfo.StreamInfo s, URL u) {
            GuarbageWatch.add(this);
            this.stream = s;
            this.url = u;
        }
    }