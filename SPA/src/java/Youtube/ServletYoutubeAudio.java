/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

import MyWeb.JavascriptSetup;
import MyWeb.MyConsole;
import Youtube.AudioFileInfoBuffer.Info;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author SoftwareEngineer7
 */
@WebServlet(name = "ServletYoutubeAudio", urlPatterns = {"/ServletYoutubeAudio"})
public class ServletYoutubeAudio extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    private static String _ffmpegFolder;

    private static String getProjectFolder() throws UnsupportedEncodingException {
        if (_ffmpegFolder == null) {
            String a = URLDecoder.decode(JavascriptSetup.class.getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
            a = a.substring(0, a.indexOf("/build/web/WEB-INF"));
            _ffmpegFolder = a + "/src/java";
        }
        return _ffmpegFolder;
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String identifier = request.getParameter("ident");
            Info info = AudioFileInfoBuffer.get(identifier);
            if (info == null) {
                return;
            }
            ProcessBuilder processBuilder = new ProcessBuilder(getProjectFolder() + "/VideoConverter/ffmpeg.exe", "-i", info.getUrl(), "-f", info.getContainer(), "-");
            Process process = processBuilder.start();
            InputStream inputStreamConverter = process.getInputStream();
            final BufferedReader bufferReaderErrorStream = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            new Thread(new Runnable() {
                @Override
                public void run() {
                    String line = null;
                    try {
                        while ((line = bufferReaderErrorStream.readLine()) != null) {
                            MyConsole.out.println(line);//process error in compilation.
                        }
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }
            }).start();
            ServletOutputStream servletOutputStream = null;
            BufferedInputStream bufferedInputStream = null;
            try {
                response.setContentType("audio/mpeg");
                response.addHeader("Content-Disposition", "attachment; filename=\"" + info.getTitle() + "."+info.getContainer()+"\"");
                response.setContentLength(-1);
                bufferedInputStream = new BufferedInputStream(inputStreamConverter);
                servletOutputStream = response.getOutputStream();
                int readBytes = 0;
                while ((readBytes = bufferedInputStream.read()) != -1) {
                    servletOutputStream.write(readBytes);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                if (servletOutputStream != null) {
                    servletOutputStream.close();
                }
                if (bufferedInputStream != null) {
                    bufferedInputStream.close();
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
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
