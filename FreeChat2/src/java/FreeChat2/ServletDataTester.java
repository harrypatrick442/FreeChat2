package FreeChat2;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import FreeChat2.scripts.others.MyConsole;
import MyWeb.Ip;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
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
@WebServlet(name = "ServletDataTester", urlPatterns = {"/datatester"})
public class ServletDataTester extends HttpServlet implements ServletContextListener {

      public void contextInitialized(ServletContextEvent event) {
          MyConsole.out.println("initialized context");
      }

      public void contextDestroyed(ServletContextEvent event) {
          MyConsole.out.println("initialized destroyed");
          //TODO ON DESTROY
      }
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        Ip.log(request);
        try {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>"
                    + "<meta name=\"description\" content=\"Free live chat site that provides a unique desktop experiance in a browser, free from annoying moderation!\" />"
                    + "<meta http-equiv=\"cache-control\" content=\"max-age=0\" />"
                    + "<meta http-equiv=\"cache-control\" content=\"no-cache\" />"
                    + "<meta http-equiv=\"expires\" content=\"0\" />"
                    + "<meta http-equiv=\"expires\" content=\"Tue, 01 Jan 1980 1:00:00 GMT\" />"
                    + "<meta http-equiv=\"pragma\" content=\"no-cache\" />");
            //marianas.js
            out.println("</head>");
            out.println("<body>");
            String timeString = Long.toString(System.currentTimeMillis());
            addScript(out, "scripts/ajax.js", timeString);
            addScript(out, "scripts/my_socket.js", timeString);
            addScript(out, "scripts/configuration.js", timeString);
            addScript(out, "scripts/data.js", timeString);
            addScript(out, "scripts/wall.js", timeString);
            addScript(out, "scripts/data_tester.js", timeString);
            out.println("<script type='text/javascript'>");
            out.println(""
                    + "</script>");
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }
    private void addScript(PrintWriter out, String path, String timeString)
    {
            out.print("<script type='text/javascript' src='");
            out.print(path);
            out.print("?t=");
            out.print(timeString);
            out.println("'></script>");
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
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
