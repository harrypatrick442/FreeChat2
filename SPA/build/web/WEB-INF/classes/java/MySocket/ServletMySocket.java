/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONException;
import org.json.JSONObject;
import MyWeb.MyConsole;
import MyWeb.Sessions;
import java.net.URLDecoder;
import java.util.Map;

/**
 *
 * @author EngineeringStudent
 */
@WebServlet(name = "ServletMySocket", urlPatterns = {"/ServletMySocket"})
@MultipartConfig(
        maxFileSize = 1024 * 1024 * 4, // 10 MB
        maxRequestSize = 1024 * 1024 * 4 // 15 MB
)
public class ServletMySocket extends HttpServlet {

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    private static void processRequest(Boolean isPost, HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("GOT REQUEST");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        System.out.println("a");
        Map<String, String[]> map = request.getParameterMap();
        for (String name: map.keySet()){
            System.out.println("param: "+name+":"+request.getParameter(name));
        } 
        String type = request.getParameter("type");
        String sessionId = request.getParameter("session_id");
        MyConsole.out.println("SESSION: " + sessionId);
        MySocket mySocket = null;
        Sessions.Session session = null;
        if (sessionId != null && sessionId != "") {
            session = Sessions.getSession(sessionId);
            if (session == null) {
                session = Sessions.getNew();
            } else {
                mySocket = (MySocket) session.getAttribute("mySocket");
            }
        } else {
            session = Sessions.getNew();
        }
        MyConsole.out.println("MYSOCKET: " + mySocket);
        MyConsole.out.println(type);
        if (type.equals("initialize")) {
            if (mySocket != null) {
                mySocket.close();//close previous wrapper, useful on page reload.
            }
            //request.getSession().setAttribute("ip", Ip.getClientIpAddr(request));
            mySocket = new MySocket(null, session, Enums.Type.AJAX, Boolean.parseBoolean((String) request.getParameter("persistent")));
            session.setAttribute("mySocket", mySocket);
            JSONObject jObject = new JSONObject();
            jObject.put("type", "initialized");
            doResponse(session, isPost, out, request, jObject);
        } else {

            if (mySocket != null) {
                if (type.equals("messages")) {
                    if (mySocket != null) {
                        System.out.println(request.getParameter("data"));
                        String data = URLDecoder.decode(request.getParameter("data"), "UTF-8");
                        mySocket.got(data);
                        doResponse(true, session, isPost, out, mySocket, request, false);
                    }
                } else {
                    if (type.equals("connect"))//not to be confused with internal interpreter one. This is for the outer ajax wrapper.
                    {
                        String name = request.getParameter("name");
                        String className = request.getParameter("class");
                        mySocket.connect(name, className);
                        JSONObject jObject = new JSONObject();
                        jObject.put("type", "connected");
                        jObject.put("name", name);
                        doResponse(session, isPost, out, request, jObject);

                    } else {
                        if (type.equals("close")) {
                            mySocket.close(request.getParameter("name"));
                            doResponse(false, session, isPost, out, mySocket, request, false);

                        } else {
                            if (type.equals("disconnect")) {
                                MyConsole.out.println("disconnecting");
                                mySocket.close();
                            } else {

                                if (type.equals("read")) {
                                    mySocket.active = true;
                                    doResponse(true, session, isPost, out, mySocket, request, true);
                                }
                            }
                        }
                    }
                }
            } else {
                //synchronized (mySocket) {
                //    JSONObject jObjectResponse = new JSONObject();
                //    jObjectResponse.put("type", "is_disconnected");
                //    out.println(jObjectResponse.toString());
                //}
            }
        }

    }

    private static void doResponse(Sessions.Session session, Boolean isPost, PrintWriter out, HttpServletRequest request, JSONObject jObjectResponse) throws JSONException {
        jObjectResponse.put("session_id", session.id);
        if (!isPost) {
            out.println(request.getParameter("callback") + "(" + jObjectResponse.toString() + ");");
        } else {
            out.println(jObjectResponse.toString());
        }
        out.flush();
    }

    private static void doResponse(Boolean includeMessages, Sessions.Session session, Boolean isPost, PrintWriter out, MySocket mySocket, HttpServletRequest request, Boolean allowWaiting) throws JSONException {

        synchronized (mySocket) {
            JSONObject jObjectResponse = includeMessages ? mySocket.getAccumulatedMessages(allowWaiting) : new JSONObject();
            JSONObject jObjectMessages = new JSONObject();
            jObjectMessages.put("messages", jObjectResponse);
            jObjectMessages.put("type", "messages");
            MyConsole.out.println("is: "+jObjectMessages.toString());
            doResponse(session, isPost, out, request, jObjectMessages);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(true, request, response);
        } catch (Exception e) {
            MyConsole.out.println(e);
        }

    }

    /**
     * Processes requests for both HTTP <code>GET</cod> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(false, request, response);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
