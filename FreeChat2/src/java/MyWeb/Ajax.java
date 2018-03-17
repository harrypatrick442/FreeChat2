/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.CookieManager;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import MyWeb.MyConsole;

/**
 *
 * @author EngineeringStudent
 */
public class Ajax {

    public enum IPMode {

        IPv4Only, IPv6Only, IPv4Pref, IPv6Pref, Any
    };

    public static class Response {

        public String response;
        public Integer responseCode;
        public boolean successful;
        public Exception ex;

        public Response(boolean successful, Integer responseCode, String response) {
            this.responseCode = responseCode;
            this.response = response;
            this.successful = successful;
        }

        public Response(boolean successful, Integer responseCode, Exception ex) {
            this.successful = successful;
            this.ex = ex;
            this.responseCode = responseCode;
        }
    }

    public static Response doPost(String url, int timeoutConnect, int timeoutRead, Map<String, String> parameters, Proxy proxy) {

        boolean successful = false;
        Integer responseCode = null;
        try {
            URL urlObject = new URL(url);
            //sun.net.www.protocol.http.HttpURLConnection con = (sun.net.www.protocol.http.HttpURLConnection) urlObject.openConnection();
            HttpURLConnection con = proxy == null ? (HttpURLConnection) urlObject.openConnection() : (HttpURLConnection) urlObject.openConnection(proxy);

            StringBuilder postData = new StringBuilder();
            if (parameters != null) {
                for (String key : parameters.keySet()) {
                    if (postData.length() != 0) {
                        postData.append('&');
                    }
                    postData.append(URLEncoder.encode(key, "UTF-8"));
                    postData.append('=');
                    postData.append(URLEncoder.encode(String.valueOf(parameters.get(key)), "UTF-8"));
                }
            }
            byte[] postDataBytes = postData.toString().getBytes("UTF-8");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestMethod("POST");
            con.setConnectTimeout(timeoutConnect);
            con.setReadTimeout(timeoutRead);
            con.setDoOutput(true);
            con.getOutputStream().write(postDataBytes);
            //wr.writeChars("output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS");
            responseCode = con.getResponseCode();
            successful = HttpsURLConnection.HTTP_OK == responseCode;
            StringBuilder sb = new StringBuilder();
            if (successful) {
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                while ((inputLine = bufferedReader.readLine()) != null) {
                    sb.append(inputLine);
                }
                bufferedReader.close();
            }
            return new Response(successful, responseCode, sb.toString());
        } catch (Exception ex) {
            return new Response(false, responseCode, ex);
        }

    }

    static TrustManager[] trustAllCerts = new TrustManager[]{
        new X509TrustManager() {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(
                    java.security.cert.X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(
                    java.security.cert.X509Certificate[] certs, String authType) {
            }
        }
    };

    static {

        SSLContext sc;
        try {
            sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            MyConsole.out.println("set all ssl trusted");
        } catch (NoSuchAlgorithmException ex) {
            Logger.getLogger(Ajax.class.getName()).log(Level.SEVERE, null, ex);
        } catch (KeyManagementException ex) {
            Logger.getLogger(Ajax.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static boolean test(String url) {
        return test(url, null);
    }

    public static boolean test(String url, CookieManager cookieManager) {
        try {
            MyConsole.out.println(url);
            URL u = new URL(url);
            HttpURLConnection con = (HttpURLConnection) u.openConnection();
            con.setRequestMethod("GET");
            if (cookieManager != null) {
                setCookies(con, cookieManager);
            }
            con.connect();
            int code = con.getResponseCode();
            MyConsole.out.println(code);
            return code == HttpsURLConnection.HTTP_OK;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    private static void parseCookiesFromResponse(HttpURLConnection con, CookieManager cookieManager) {

        Map<String, List<String>> headerFields = con.getHeaderFields();
        List<String> cookiesHeader = headerFields.get("Set-Cookie");

        if (cookiesHeader != null) {
            for (String cookie : cookiesHeader) {
                cookieManager.getCookieStore().add(null, HttpCookie.parse(cookie).get(0));
            }
        }
    }

    private static void setCookies(HttpURLConnection con, CookieManager cookieManager) {

        if (cookieManager.getCookieStore().getCookies().size() > 0) {
            // While joining the Cookies, use ',' or ';' as needed. Most of the servers are using ';'
            List<HttpCookie> cookies = cookieManager.getCookieStore().getCookies();
            StringBuffer sb = new StringBuffer();
            boolean first = true;
            for (HttpCookie cookie : cookies) {
                if (first) {
                    first = false;
                } else {
                    sb.append(";");
                }
                sb.append(cookie.toString());
            }
            con.setRequestProperty("Cookie", sb.toString());
        }
    }

    private static String getEncoding(HttpURLConnection con) {

        String enc = con.getContentEncoding();
        if (enc == null) {
            Pattern p = Pattern.compile("charset=(.*)");
            Matcher m = p.matcher(con.getHeaderField("Content-Type"));
            if (m.find()) {
                enc = m.group(1);
            } else {
                enc = "UTF-8";
            }
        }
        return enc;
    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead) {
        return doGet(url, timeoutConnect, timeoutRead, null);
    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead, CookieManager cookieManager) {
        return doGet(url, timeoutConnect, timeoutRead, cookieManager, null);
    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead, CookieManager cookieManager, Proxy proxy) {
        return doGet(url, timeoutConnect, timeoutRead, cookieManager, proxy, null);
    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead, CookieManager cookieManager, Proxy proxy, String referer) {
        return doGet(url, timeoutConnect, timeoutRead, cookieManager, proxy, referer, null);

    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead, CookieManager cookieManager, Proxy proxy, String referer, String userAgent) {
        return doGet(url, timeoutConnect, timeoutRead, cookieManager, proxy, referer, userAgent, IPMode.Any);

    }

    public static class CouldNotUserIPModeException extends Exception {

        public CouldNotUserIPModeException() {
            super();
        }

        public CouldNotUserIPModeException(String message) {
            super(message);
        }
    }

    private static List<URL> getIpvSpecificUrl(URL url, IPMode iPMode) throws URISyntaxException, UnknownHostException, CouldNotUserIPModeException {

        if (iPMode != IPMode.Any) {
            InetAddress[] inetAddresses = InetAddress.getAllByName(url.getHost());
            InetAddress selectedInetAddress = null;
            List<URL> listNewUrls = new ArrayList<URL>();
            for (InetAddress inetAddress : inetAddresses) {
                if (((IPMode.IPv4Pref == iPMode || IPMode.IPv4Only == iPMode) ? inetAddress instanceof Inet4Address : inetAddress instanceof Inet6Address));
                {
                    MyConsole.out.println(url.getProtocol() + "://" + inetAddress.getHostAddress() + (url.getPath() != null ? url.getPath() : "") + (url.getQuery() != null ? "?" + url.getQuery() : ""));
                    try {
                        listNewUrls.add(new URL(url.getProtocol() + "://" + inetAddress.getHostAddress() + (url.getPath() != null ? url.getPath() : "") + (url.getQuery() != null ? "?" + url.getQuery() : "")));
                    } catch (MalformedURLException ex) {
                    }
                }
                return listNewUrls;
            }
            if ((IPMode.IPv6Pref != iPMode && IPMode.IPv4Pref != iPMode)) {
                throw new CouldNotUserIPModeException();
            }
        }
        return null;
    }

    private static HttpURLConnection prepareConnection(URL urlObject, Proxy proxy, int timeoutConnect, int timeoutRead, CookieManager cookieManager, String referer, String userAgent) throws IOException {
        HttpURLConnection con = proxy == null ? (HttpURLConnection) urlObject.openConnection() : (HttpURLConnection) urlObject.openConnection(proxy);
        con.setConnectTimeout(timeoutConnect);
        con.setReadTimeout(timeoutRead);
        con.setRequestMethod("GET");
        con.setDoInput(true);
        // con.setUseCaches(true);con.setRequestProperty("Connection","Keep-Alive");
        //con.setRequestProperty("useragent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.10) Gecko/2009042316 Firefox/3.0.10 (.NET CLR 3.5.30729)");

        if (cookieManager != null) {
            setCookies(con, cookieManager);
        }
        con.setRequestProperty("User-Agent", userAgent==null?"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36":userAgent);
        if (referer != null) {
            con.addRequestProperty("Referer", referer);
        }
        return con;
    }

    public static Response doGet(String url, int timeoutConnect, int timeoutRead, CookieManager cookieManager, Proxy proxy, String referer, String userAgent, IPMode iPMode) {

        Integer responseCode = null;
        try {
            URL urlObject = new URL(url);
            List<URL> ipvSpecificUrls = getIpvSpecificUrl(urlObject, iPMode);
            HttpURLConnection con = null;
            if (ipvSpecificUrls != null) {// should be any inet address returned

                for (URL ipvSpecificUrl : ipvSpecificUrls) {
                    try {
                        HttpURLConnection conTemp = prepareConnection(ipvSpecificUrl, proxy, timeoutConnect, timeoutRead, cookieManager, referer, userAgent);
                        responseCode = conTemp.getResponseCode();
                        con = conTemp;
                        break;
                    } catch (Exception ex) {

                    }
                }
                if (con == null) {
                    con = prepareConnection(urlObject, proxy, timeoutConnect, timeoutRead, cookieManager, referer, userAgent);
                    responseCode = con.getResponseCode();
                }
            } else {
                con = prepareConnection(urlObject, proxy, timeoutConnect, timeoutRead, cookieManager, referer, userAgent);
                responseCode = con.getResponseCode();
            }
            MyConsole.out.println("Response Code : " + responseCode);
            
            String enc = getEncoding(con);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream(), enc));
            StringBuffer sb = new StringBuffer();
            boolean successful = HttpsURLConnection.HTTP_OK == responseCode;
            if (successful) {
                if (cookieManager != null) {
                    parseCookiesFromResponse(con, cookieManager);
                }
                String inputLine;
                while ((inputLine = bufferedReader.readLine()) != null) {
                    sb.append(inputLine);
                    sb.append("\n");
                }
                bufferedReader.close();
            }
            return new Response(successful, responseCode, sb.toString());
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, responseCode, ex);
        }
    }
}
