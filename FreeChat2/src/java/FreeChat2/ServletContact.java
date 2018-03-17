package FreeChat2;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import MyWeb.Emailing;
import MyWeb.ContactEmail;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
@WebServlet(urlPatterns = {"/ServletContact"})
public class ServletContact extends HttpServlet {

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
        JSONObject jObjectReply = new JSONObject();
        String message = "An undefined error occured during sending the message!";
        boolean successful = false;
        try {
            StringBuffer sb = new StringBuffer();
            String line = null;
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String dataEncoded = sb.toString();
            if (dataEncoded != null) {
                byte[] decoded = Base64.decodeBase64(dataEncoded);
                JSONObject jObjectData = new JSONObject(new String(decoded, "UTF-8"));
                ContactEmail contactEmail = new ContactEmail(jObjectData, "awonderfulmachine@gmail.com");
                if (contactEmail.emailFrom != null && !contactEmail.emailFrom.equals("")) {
                    Emailing.send(contactEmail.getEmail());
                    successful = true;
                } else {
                    message = "Enter a valid contact email please!";
                }
            }
        } catch (Exception ex) {
            message = "Sorry, a general exception occured!";
            ex.printStackTrace();
        } finally {
            try {
                jObjectReply.put("success", successful);
                if (!successful) {
                    jObjectReply.put("message", message);
                }
                out.println(new String(Base64.encodeBase64(jObjectReply.toString().getBytes())));
            } catch (Exception ex) {

            }
            out.close();
        }
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
