/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import MyWeb.ImageProcessing;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLConnection;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author EngineeringStudent
 */
@WebServlet(name = "ServletImages", urlPatterns = {"/ServletImages"})
public class ServletImages extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) {

        try {
            String relativePath = request.getParameter("path");
            if (relativePath != null && !relativePath.equals("")) {
                String fullPath = ImageProcessing.getTempFolder() + File.separator + relativePath;
                if (new File(fullPath).exists()) {
                    response.setContentType(URLConnection.guessContentTypeFromName(fullPath));
                    String surfix = getFileNameSurfix(fullPath);
                    if (surfix != null && !surfix.equals("")) {
                        File file = new File(fullPath);
                        OutputStream outputStream = response.getOutputStream();
                        try {
                            BufferedImage bufferedImage = ImageIO.read(file);
                            if (bufferedImage != null) {
                                ImageIO.write(bufferedImage, surfix, outputStream);
                            }
                        } catch (IOException ex) {

                        } finally {
                            outputStream.close();
                        }

                    }
                }
            }

        } catch (Exception ex) {

        }
    }

    private String getFileNameSurfix(String fileName) {

        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            return fileName.substring(i + 1);
        }
        return null;
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
