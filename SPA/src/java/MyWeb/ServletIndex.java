package MyWeb;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import FreeChat2.Room;
import FreeChat2.Rooms;
import FreeChat2.Wall;
import FreeChat2.Walls;
import MySocket.AsynchronousSenders;
import MyWeb.Database.Database;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;

/**
 *
 * @author EngineeringStudent
 */
@WebServlet(name = "ServletIndex", urlPatterns = {"/index"})
public class ServletIndex extends HttpServlet {

    private static String indexMobile;
    private static String indexDesktop;
    private static String completeChatLoadJavaScript;
    private static Boolean isDevelopmentMachine = null;
    private static String getHeadContent(Boolean isMobile) {

        String str = "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">";
        str += (isMobile ? "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0\" />" : "");
        str += "<meta name=\"description\" content=\"" + Configuration.getDescription() + "\" />"
                + "<meta http-equiv=\"cache-control\" content=\"max-age=0\" />"
                + "<meta http-equiv=\"cache-control\" content=\"no-cache\" />"
                + "<meta http-equiv=\"expires\" content=\"0\" />"
                + "<meta http-equiv=\"expires\" content=\"Tue, 01 Jan 1980 1:00:00 GMT\" />"
                + "<meta http-equiv=\"pragma\" content=\"no-cache\" />"
                + "<link rel=\"icon\" type=\"image/png\" href=\"" + Configuration.getFavicon() + "\">"
                + "<title>" + Configuration.getTitle() + "</title>"
                + ""
                + "<script>\n"
                + "  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n"
                + "  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n"
                + "  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n"
                + "  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n"
                + "\n"
                + "  ga('create', '" + Configuration.getAnalyticsTrackingId() + "', 'auto');\n"
                + "  ga('send', 'pageview');\n"
                + "\n"
                + "</script>"
                +Configuration.getAddSenseScripts();
        return str;
    }

    private String getJsFileName(Boolean isMobile, Boolean push, Boolean redoIfDone, String pageType, String pageUrl) throws FileNotFoundException, UnsupportedEncodingException {
        StringBuffer sb = new StringBuffer();
        sb.append("var isMobile=");
        sb.append(isMobile);
        sb.append(";");
        sb.append("window.isCors=" + Configuration.isCors + ";");
        // sb.append(JavascriptSetup.getFileContent("/MyWeb/scripts/as_needed.js"));
        String before = sb.toString();
        sb = new StringBuffer();
        sb.append(Configuration.getJsString(isMobile, pageType));
        ServletContext servletContext = this.getServletContext();
        sb.append(ImageProcessing.getPreloadJavascript(servletContext, pageType));
        if (pageType.contains("video")) {
            sb.append("var lobby = new LobbyVideoDownloader();");
        } else {
            sb.append("var lobby = new Lobby();");
        }
        String fileName = JavascriptSetup.getScriptFileName(servletContext, push, redoIfDone, pageType, before, sb.toString(), Configuration.getInterface());
        try {
            completeChatLoadJavaScript = JavascriptSetup.getCompleteChatJavaScript(fileName, isDevelopmentMachine, Configuration.getInterface());
        } catch (FileNotFoundException ex) {
            ex.printStackTrace();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return fileName;
    }

    private String getIndexBody(Boolean isMobile, String pageType, String pageUrl) throws FileNotFoundException, UnsupportedEncodingException, Exception {

        StringBuffer sb = new StringBuffer();
        String timeString = Long.toString(System.currentTimeMillis());
        for (String path : Configuration.getStylesToLoad()) {
            ServletHelper.addStyle(sb, path, timeString);
        }
        sb.append("<body>");
        sb.append("<script type='text/javascript'>"
                + "    var bodyDefaultDisplay=document.body.style.display;"
                + "      document.body.style.display='none';"
                + "</script>");
        sb.append(StaticContent.get(pageType));
        sb.append(Adverts.get());
        sb.append("</body>");
        sb.append("<script type='text/javascript'>window.thePageUrl ='");
        MyConsole.out.println("page is: " + pageUrl.substring(pageUrl.length() - 1, pageUrl.length()).equals("/"));
        sb.append(pageUrl + (pageUrl.substring(pageUrl.length() - 1, pageUrl.length()).equals("/") ? "" : "/"));
        sb.append("';");
        if (pageType.contains("all")) {

            sb.append("var openOnEnter =");
            Iterator<Room> iterator = Rooms.getOpenOnEnter(Database.getInstance(), AsynchronousSenders.getInstance()).iterator();
            JSONArray openOnEnter = new JSONArray();
            while (iterator.hasNext()) {
                Room room = iterator.next();
                openOnEnter.put(room.getJSONObject(Database.getInstance()));
            }
            sb.append(openOnEnter.toString());
            sb.append(";");
            /*
            if (Configuration.wallsEnabled) {
                sb.append("var openOnEnterWalls =");
                Iterator<Wall> iteratorWalls = Walls.openOnEnter.iterator();
                openOnEnter = new JSONArray();
                while (iteratorWalls.hasNext()) {
                    try {
                        openOnEnter.put(iteratorWalls.next().getJSONObject());
                    } catch (JSONException ex) {

                    }
                }
                sb.append(openOnEnter.toString());
                sb.append(";");
            }*/
        }
        sb.append("</script>");
        ServletHelper.addScript(sb, getJsFileName(isMobile, true, false, pageType, pageUrl), timeString);
        sb.append("</html>");
        return sb.toString();
    }

    private static String getIndexHeaderMobile() {

        StringBuffer sb = new StringBuffer();
        /* TODO output your page here. You may use following sample code. */
        sb.append("<!DOCTYPE html>");
        sb.append("<html>");
        sb.append("<head>");
        sb.append(getHeadContent(true));
        //marianas.js
        sb.append("</head>");
        return sb.toString();
    }

    private static String getIndexHeader() {
        StringBuffer sb = new StringBuffer();
        sb.append("<!DOCTYPE html>");
        sb.append("<html>");
        sb.append("<head>");
        sb.append(getHeadContent(false));
        sb.append("</head>");
        return sb.toString();
    }

    private String getIndex(HttpServletRequest request, Boolean isMobile, String pageType, String pageUrl) throws Exception {
        StringBuffer sb = new StringBuffer();
        String index;
        if (isMobile) {
            if (indexMobile == null) {
                sb.append(getIndexHeaderMobile());
                sb.append(getIndexBody(true, pageType, pageUrl));
                indexMobile = sb.toString();
            }
            index = indexMobile;
        } else {
            if (indexDesktop == null) {
                sb.append(getIndexHeader());
                sb.append(getIndexBody(false, pageType, pageUrl));
                indexDesktop = sb.toString();
            }
            index = indexDesktop;
        }
        return index;
    }

    private static String getPageType(String url, boolean isMobile) {
        url = url.toLowerCase();
        return (Configuration.pageType.toString().toLowerCase()) + "_" + (isMobile ? "mobile" : "desktop");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");
        System.out.println(request.getHeader("User-Agent"));
        PrintWriter out = response.getWriter();
        Ip.log(request);
        UAgentInfo uAgentInfo = new UAgentInfo(request.getHeader("user-agent"), request.getHeader("accept"));
        Boolean isMobile = uAgentInfo.detectMobileLong();
        String pageUrl = ((HttpServletRequest) request).getRequestURL().toString();
        String pageType = getPageType(pageUrl, isMobile);
        if (null == isDevelopmentMachine) {
            isDevelopmentMachine = pageUrl.contains("localhost") || true;
        }
        try {
            Map<String, String[]> params = request.getParameterMap();
            if (params.containsKey("secret_set_controls")) {
                if (!params.containsKey("operation")) {
                    out.println(Controls.getControls());
                } else {
                    if (isDevelopmentMachine) {
                        String operation = (String) params.get("operation")[0];
                        if (operation.equals("generate_and_push")) {
                            getJsFileName(false, true, true, "desktop", pageUrl);
                            getJsFileName(true, true, true, "mobile", pageUrl);
                            indexMobile = null;
                            indexDesktop = null;
                        } else {
                            if (operation.equals("generate")) {
                                getJsFileName(false, false, true, "desktop", pageUrl);
                                getJsFileName(true, false, true, "mobile", pageUrl);
                                indexMobile = null;
                                indexDesktop = null;
                            } else {
                                if (operation.equals("get_guarbage_watch_summary")) {
                                    out.println(GuarbageWatch.getSummary());
                                } else {
                                    if (operation.equals("generate_initial_settings")) {

                                        JavascriptSetup.setFileContent("/FreeChat2/scripts/initial_settings.js", (String) params.get("js_code")[0], false);
                                        JavascriptSetup.setFileContent("/FreeChat2/scripts/initial_settings.js", (String) params.get("js_code")[0], true);
                                    } else {
                                        if (operation.equals("clear_scripts_list")) {
                                            JavascriptSetup.clearScriptsList();
                                        } else {
                                            if (operation.equals("clear_static_content")) {
                                                StaticContent.clear();
                                            } else {
                                                if (operation.equals("test")) {
                                                    try {
                                                        Test.run(new PrintWriter(out));
                                                    } catch (Exception ex) {
                                                        out.println(ex);
                                                    }
                                                    out.println("Passed the test");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (params.containsKey("type")) {
                    String type = (String) params.get("type")[0];
                    if (type.equals("get_js_generated")) {
                        if (!isMobile) {
                            out.println(completeChatLoadJavaScript);
                        }
                    }
                } else {
                    out.println(getIndex(request, isMobile, pageType, pageUrl));
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            out.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String[]> params = request.getParameterMap();
        for (String str : params.keySet()) {
            MyConsole.out.println(str);
        }
        String operation = params.get("operation")[0];
        if (operation.equals("set_static_content")) {
            UAgentInfo uAgentInfo = new UAgentInfo(request.getHeader("user-agent"), request.getHeader("accept"));
            Boolean isMobile = uAgentInfo.detectMobileLong();
            String url = ((HttpServletRequest) request).getRequestURL().toString();
            String pageType = getPageType(url, isMobile);
            StaticContent.set(pageType, params.get("html")[0]);
            indexMobile = null;
            indexDesktop = null;
        } else {
            JavascriptSetup.set((String) params.get("js_code")[0], this.getServletContext(),
                    params.get("type")[0]);
            indexMobile = null;
            indexDesktop = null;
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
