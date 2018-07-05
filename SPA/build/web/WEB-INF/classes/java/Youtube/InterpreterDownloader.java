/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

import MySocket.AsynchronousSender;
import MyWeb.GuarbageWatch;
import MyWeb.Interpreter;
import MyWeb.MyConsole;
import MyWeb.Sessions.Session;
import Youtube.AudioFileInfoBuffer.Info;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer
 */
public class InterpreterDownloader extends Interpreter implements IDownloader, IAudioFileInfoBuffer {

   
    private AsynchronousSender asynchronousSender;
    private static Downloader downloader = new Downloader();
    private List<Info> listInfoReferences = new ArrayList<Info>();

    public InterpreterDownloader(AsynchronousSender asynchronousSender) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
    }

    public void interpret(JSONObject jObject, Session session) throws Exception {
        try {
System.out.println("interpreter");
            String type = jObject.getString("type");
            if (type.equals("download")) {
                download(jObject);
            } else {
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void download(JSONObject jObject) throws JSONException {
        String url = jObject.getString("url");
        System.out.println("got");
        listInfoReferences.clear();
        System.out.println("is: "+url);
        downloader.getLinks(url, this, this);
    }

    private void retry() {
        downloader.retry();
    }

    @Override
    public void getHtml() {
        JSONObject jObject = new JSONObject();
        try {
            jObject.put("type", "get_html");
        } catch (JSONException ex) {
        }
        asynchronousSender.send(jObject);
    }

    @Override

    public void done(final List<LinkInfo> linksVideos, List<LinkInfo> linksAudios, List<String> cookies, String title, String icon) {
        JSONArray jArrayLinksVideos = new JSONArray();
        JSONArray jArrayLinksAudios = new JSONArray();
        JSONObject jObjectReply = new JSONObject();
        for (LinkInfo link : linksVideos) {
            try {
                JSONObject jObjectLink = new JSONObject();
                jObjectLink.put("format", link.container);
                jObjectLink.put("url", link.url);
                jObjectLink.put("quality", link.quality.toString());
                jArrayLinksVideos.put(jObjectLink);
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
        }
        try {
            jObjectReply.put("links_videos", jArrayLinksVideos);

        } catch (JSONException ex) {
            ex.printStackTrace();
        }
        for (LinkInfo link : linksAudios) {
            try {
                JSONObject jObjectLink = new JSONObject();
                jObjectLink.put("format", link.container);
                jObjectLink.put("url", link.url);
                jArrayLinksAudios.put(jObjectLink);
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
        }
        try {
            jObjectReply.put("links_audios", jArrayLinksAudios);

        } catch (JSONException ex) {
            ex.printStackTrace();
        }
        JSONArray jArrayCookies = new JSONArray();
        for (String cookie : cookies) {
            jArrayCookies.put(cookie);
        }
        try {
            jObjectReply.put("cookies", jArrayCookies);
            jObjectReply.put("type", "done");
            try {
                jObjectReply.put("title", title);
            } catch (JSONException ex) {

            }
            jObjectReply.put("icon", icon);
        } catch (JSONException ex) {
        }
        asynchronousSender.send(jObjectReply);

    }

    @Override
    public void failed(String message) {
        JSONObject jObjectReply = new JSONObject();
        try {
            if (message != null) {
                jObjectReply.put("message", message);
            }
            jObjectReply.put("type", "failed");
            asynchronousSender.send(jObjectReply);
            MyConsole.out.println("failed url sent");
        } catch (JSONException ex) {
        }
    }

    @Override
    public void failed() {
        failed(null);
    }

    @Override
    public void progress(String message) {
        MyConsole.out.println("progress");
        JSONObject jObjectReply = new JSONObject();
        try {
            if (message != null) {
                jObjectReply.put("message", message);
            }
            jObjectReply.put("type", "progress");
            MyConsole.out.println("sent acquiring the video's sources.");
            asynchronousSender.send(jObjectReply);
            MyConsole.out.println("sent acquiring the video's sources... sent");
        } catch (JSONException ex) {
        }
    }

    @Override
    public void close(Session session) {

        listInfoReferences.clear();
    }

    @Override
    public void storeReferenceForLifetime(AudioFileInfoBuffer.Info info) {
        listInfoReferences.add(info);
    }

}
