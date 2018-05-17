package Youtube;

import Database.UUID;
import MyWeb.GuarbageWatch;
import MyWeb.InterfaceLooper;
import MyWeb.MinuteLooper;
import MyWeb.StopWatch;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class AudioFileInfoBuffer {

    private static Map<String, WeakReference<Info>> mapGuidToInfo = new HashMap<String, WeakReference<Info>>();

    static {
        MinuteLooper.add(new InterfaceLooper() {
            @Override
            public void run(AtomicBoolean removeUnused) {
                synchronized (mapGuidToInfo) {
                    for (String key : mapGuidToInfo.keySet()) {
                        if (mapGuidToInfo.get(key).isEnqueued()) {
                            mapGuidToInfo.remove(key);
                        } else if (mapGuidToInfo.get(key).get() == null) {
                            mapGuidToInfo.remove(key);
                        }
                    }
                }
            }
        });
    }

    public static class Info {

        private String url;
        private String title;
        private String container;
        private StopWatch stopWatch = new StopWatch();

        public Info(String url, String title, String container) {
            GuarbageWatch.add(this);
            this.url = url;
            this.title = title;
            this.container = container;
        }

        public String getUrl() {
            return url;
        }

        public String getTitle() {
            return title;
        }

        public String getContainer() {
            return container;
        }

        public StopWatch getStopWatch() {
            return stopWatch;
        }
    }

    public static String add(String url, String title, String container, IAudioFileInfoBuffer iAudioFileInfoBuffer) {
        String guid;

        synchronized (mapGuidToInfo) {
            do {
                guid = new UUID().toString();
            } while (mapGuidToInfo.get(guid) != null);
            Info info = new Info(url, title, container);
            iAudioFileInfoBuffer.storeReferenceForLifetime(info);
            mapGuidToInfo.put(guid, new WeakReference<Info>(info));
        }
        return guid;
    }

    public static Info get(String guid) {
        synchronized (mapGuidToInfo) {
            WeakReference<Info> weakReference = mapGuidToInfo.get(guid);
            if (weakReference != null) {
                return weakReference.get();
            }
            return null;
        }
    }
}
