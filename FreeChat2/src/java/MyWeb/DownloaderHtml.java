/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import Database.ConnectionsPool;
import MyWeb.Ajax.IPMode;
import java.net.CookieManager;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 *
 * @author SoftwareEngineer
 */
public class DownloaderHtml implements IGetHtml {

    private final static String jdbcDriver = "org.gjt.mm.mysql.Driver";
    private final static String dbUrl = "jdbc:mysql://localhost:3306/proxies";
    private final static String user = "root";
    private final static String password = "Afucka9";
    private String userAgent;
    private static Proxies _proxies;

    private static Proxies getProxies() {
        return _proxies == null ? (_proxies = new Proxies(new ConnectionsPool(jdbcDriver, dbUrl, user, password, 1, 10))) : _proxies;
    }

    private static class HtmlInstancesContainer {

        private static final Map<String, HtmlInstancesContainer> mapUrlToHtmlInstancesContainer = new HashMap<String, HtmlInstancesContainer>();

        static {
            MinuteLooper.add(new InterfaceLooper() {
                @Override
                public void run(AtomicBoolean removeUnused) {
                    synchronized (mapUrlToHtmlInstancesContainer) {
                        for (String key : mapUrlToHtmlInstancesContainer.keySet()) {
                            if (mapUrlToHtmlInstancesContainer.get(key).stopWatch.get_ms() > 120000) {
                                mapUrlToHtmlInstancesContainer.remove(key);
                            }
                        }
                    }
                }
            });
        }
        private String url;
        private StopWatch stopWatch = new StopWatch();

        public HtmlInstancesContainer(String url) {
            this.url = url;
        }

        public StopWatch getStopWatch() {
            return stopWatch;
        }
        //XXX implement cleanup
        private volatile List<String> instances = new ArrayList<String>();

        public void addInstance(String html) {
            if (html != null) {
                synchronized (instances) {
                    instances.add(html);
                }
            }
        }

        public String get() {
            synchronized (instances) {
                if (instances.size() > 0) {
                    String html = instances.get(0);
                    instances.remove(0);
                    return html;
                }
            }
            return null;
        }

        public int size() {
            return instances.size();
        }

        public static HtmlInstancesContainer get(String url) {
            synchronized (mapUrlToHtmlInstancesContainer) {
                HtmlInstancesContainer htmlInstancesContainer = mapUrlToHtmlInstancesContainer.get(url);
                if (htmlInstancesContainer == null) {
                    htmlInstancesContainer = new HtmlInstancesContainer(url);
                    mapUrlToHtmlInstancesContainer.put(url, htmlInstancesContainer);
                }
            return htmlInstancesContainer;
            }
        }
    }
    private boolean allowProxy;

    public DownloaderHtml(Boolean allowProxy, Boolean isMobile) {
            GuarbageWatch.add(this);
        this.allowProxy = allowProxy;
        if(isMobile)
            userAgent="Mozilla/5.0 (Linux; Android 4.4.3; HTC Desire 510 Build/KTU84L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.124 Mobile Safari/537.36";
    }

    @Override
    public String getHtml(URL url, CookieManager cookieManager, Boolean useProxy, AtomicBoolean stop, IPMode iPMode) throws PageNotFoundException, MalformedURLException {
        if (useProxy && allowProxy) {
            getHtmlThroughProxy(url.toString(), cookieManager);
        } else {
            Ajax.Response response = Ajax.doGet(url.toString(), 10000, 10000, cookieManager, null, url.toString(), userAgent, iPMode);
            if (response.successful) {
                return response.response;
            } else {
                if (response.responseCode == 404) {
                    throw new PageNotFoundException();
                } else {
                    if (MalformedURLException.class.equals(response.ex.getClass())) {
                        throw (MalformedURLException) response.ex;
                    }
                }
            }
        }
        return null;
    }

    public String getHtmlThroughProxy(String url, CookieManager cookieManager) throws PageNotFoundException {
        return getHtmlThroughProxy(url, cookieManager, IPMode.Any);
    }

    public String getHtmlThroughProxy(String url, CookieManager cookieManager, IPMode iPMode) throws PageNotFoundException {
        //iDownloader.getHtml();
        AtomicCountDownLatch atomicCountDownLatch = new AtomicCountDownLatch();
        HtmlInstancesContainer htmlInstancesContainer = HtmlInstancesContainer.get(url);
        int existingInstances = htmlInstancesContainer.size();
        try {
            List<RunnableHtmlThroughProxy> runnables = new ArrayList<RunnableHtmlThroughProxy>();
            for (int i = 0; i < 3 - existingInstances; i++) {
                RunnableHtmlThroughProxy runnable = new RunnableHtmlThroughProxy(url, cookieManager, atomicCountDownLatch, htmlInstancesContainer, iPMode);
                runnables.add(runnable);
            }
            while (runnables.size() > 0) {
                atomicCountDownLatch.await();
                synchronized (atomicCountDownLatch) {
                    Iterator<RunnableHtmlThroughProxy> iterator = runnables.iterator();
                    boolean hasUndon = false;
                    while (iterator.hasNext()) {
                        RunnableHtmlThroughProxy runnable = iterator.next();
                        if (runnable.done) {
                            if (!runnable.response.successful) {
                                if (runnable.response.responseCode == 404) {
                                    throw new PageNotFoundException();
                                }
                            }
                            iterator.remove();
                            if (htmlInstancesContainer.size() > 0) {
                                break;
                            }
                        } else {
                            hasUndon = true;
                        }
                    }
                    if (htmlInstancesContainer.size() > 0) {
                        break;
                    }
                    if (hasUndon) {
                        atomicCountDownLatch.latch();
                    }
                }
            }
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
        if (htmlInstancesContainer.size() <= 0) {
            int i = 0;
            while (i < 20) {
                MyConsole.out.println("failed to get html");
                i++;
            }
        }
        return htmlInstancesContainer.get();
    }

    private class RunnableHtmlThroughProxy implements Runnable {

        private String url;
        public volatile boolean done = false;
        private AtomicCountDownLatch atomicCountDownLatch;
        private HtmlInstancesContainer htmlInstancesContainer;
        private CookieManager cookieManager;
        public Ajax.Response response;
        private IPMode iPMode;

        public RunnableHtmlThroughProxy(String url, CookieManager cookieManager, AtomicCountDownLatch atomicCountDownLatch, HtmlInstancesContainer htmlInstancesContainer, IPMode iPMode) {
            MyConsole.out.println("RunnableHtmlThroughProxy");
            this.url = url;
            this.atomicCountDownLatch = atomicCountDownLatch;
            this.htmlInstancesContainer = htmlInstancesContainer;
            this.cookieManager = cookieManager;
            this.iPMode = iPMode;
            new Thread(this).start();
        }

        @Override
        public void run() {
            try {
                response = Ajax.doGet(url, 20000, 20000, cookieManager, getProxy(), url, userAgent, iPMode);
                if (response.successful) {
                    htmlInstancesContainer.addInstance(response.response);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                done = true;
                MyConsole.out.println("done one");
                synchronized (atomicCountDownLatch) {
                    atomicCountDownLatch.countDown();
                }
            }
        }
    }

    public Proxy getProxy() {

        try {
            Proxy proxy = getProxies().getRandomProxy(false);
            if (proxy != null) {
                return proxy;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
