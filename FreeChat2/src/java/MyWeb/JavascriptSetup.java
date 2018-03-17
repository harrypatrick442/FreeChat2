package MyWeb;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.google.javascript.jscomp.*;
import java.io.FileWriter;
import java.util.List;
import java.util.ArrayList;
import java.util.logging.Level;
import org.apache.commons.io.FilenameUtils;

public class JavascriptSetup {

    private static Map<String, String> mapTypeStringToScriptFileName = new HashMap<String, String>();
    private static Map<Integer, String> mapLineToFile = new LinkedHashMap<Integer, String>();

    public static String getScriptFileName(ServletContext servletContext, Boolean push, Boolean redoIfDone, Boolean isMobile, String jsBefore, String jsAfter, InterfaceConfiguration interfaceConfiguration) {
        return getScriptFileName(servletContext, push, redoIfDone, isMobile ? "mobile" : "desktop", jsBefore, jsAfter, interfaceConfiguration);
    }

    public static String getScriptFileName(ServletContext servletContext, Boolean push, Boolean redoIfDone, String typeString, String jsBefore, String jsAfter, InterfaceConfiguration interfaceConfiguration) {
        String scriptFileName = mapTypeStringToScriptFileName.get(typeString);
        if (scriptFileName == null || Configuration.debugging || redoIfDone) {
            String js = prepare(servletContext, typeString, jsBefore, jsAfter, interfaceConfiguration);
            if (js != null) {
                sendToRemoteMachine(js, typeString);
            }
        }
        return mapTypeStringToScriptFileName.get(typeString);
    }

    private static String prepare(ServletContext servletContext, String typeString, String jsBefore, String jsAfter, InterfaceConfiguration interfaceConfiguration) {
        try {
            StringBuffer sb = new StringBuffer();
            sb.append(jsBefore);
            sb.append(merge(jsAfter, typeString, interfaceConfiguration).toString());
            sb.append(jsAfter);
            String js = sb.toString();
            if (Configuration.obfuscate) {
                js = obfuscate(js);
            }
            if (js != null) {
                saveFile(js, servletContext, typeString);
                return js;
            }
            return js;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static void set(String js, ServletContext servletContext, String typeString) {
        try {
            if (js != null) {
                saveFile(js, servletContext, typeString);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private static void sendToRemoteMachine(String js, String typeString) {
        if (Configuration.remoteMachine != null) {
            Map<String, String> parameters = new LinkedHashMap<String, String>();
            parameters.put("js_code", js);
            parameters.put("type", typeString);
            parameters.put("operation", "set_js");
            Ajax.doPost((Configuration.remoteMachine.substring(Configuration.remoteMachine.length() - 2, Configuration.remoteMachine.length() - 1).equals('/') ? Configuration.remoteMachine.substring(0, Configuration.remoteMachine.length() - 2) : Configuration.remoteMachine) + "?secret_set_generated=TRUE", 30000, 30000, parameters, null);
        }
    }

    private static StringBuffer merge(String rootScript, String typeString, InterfaceConfiguration interfaceConfiguration) throws IOException, Exception {
        StringBuffer sb = new StringBuffer();
        int length = 0;
        mapLineToFile = new LinkedHashMap<Integer, String>();
        for (String path : getJsFilePathsInOrderOfDependancy(rootScript, typeString, interfaceConfiguration)) {
            String str = getFileContent(path, sb);
            sb.append("\n");
            mapLineToFile.put(length, path);
            length += countLines(str) + 2;
        }
        return sb;
    }

    public static String getFileContent(String path) {
        return getFileContent(path, null);
    }

    public static String getFileContent(String path, StringBuffer sb) {
        InputStream inputStream = JavascriptSetup.class.getResourceAsStream(path);
        String str = convertStreamToString(inputStream);
        if (sb != null) {
            sb.append(str);
        }
        return str;
    }

    private static String getProjectFolder() throws UnsupportedEncodingException {
        String a = URLDecoder.decode(JavascriptSetup.class.getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
        a = a.substring(0, a.indexOf("/build/web/WEB-INF"));
        return a + "/src/java";
    }

    public static void setFileContent(String path, String str, Boolean buildFolder) throws UnsupportedEncodingException {
        if (!buildFolder) {
            path = getProjectFolder() + path;
        } else {
            path = JavascriptSetup.class.getResource(path).getPath();
        }
        MyConsole.out.println(path);
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(path));
            writer.write(str);

        } catch (IOException e) {
            MyConsole.out.println(e);
        } finally {
            try {
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                MyConsole.out.println(e);
            }
        }
    }

    private static String obfuscate(String js) throws IOException {
        if (false) {
            Map<String, String> parameters = new LinkedHashMap<String, String>();
            parameters.put("js_code", js);
            parameters.put("output_info", "errors");
            parameters.put("output_format", "json");
            parameters.put("compilation_level", "SIMPLE_OPTIMIZATIONS");
            Ajax.Response response = Ajax.doPost("http://closure-compiler.appspot.com/compile", 30000, 30000, parameters, null);
            if (response.successful) {
                try {
                    JSONObject jObject = new JSONObject(response.response);
                    boolean hasErrors = true;
                    JSONArray jObjectErrors = null;
                    try {
                        jObjectErrors = jObject.getJSONArray("errors");
                    } catch (JSONException ex) {
                        hasErrors = false;
                    }

                    if (hasErrors) {
                        if (jObjectErrors.length() > 0) {
                            for (int i = 0; i < jObjectErrors.length(); i++) {
                                JSONObject jObjectError = jObjectErrors.getJSONObject(i);
                                MyConsole.out.println(jObjectError.toString());
                                try {
                                    Tuple<String, Integer> info = getFileNameForError(jObjectError);
                                    String fileNameForError = info.x;
                                    String error = jObjectError.getString("error");
                                    String line = jObjectError.getString("line");
                                    int lineNumber = info.y;
                                    MyConsole.out.println("Error: " + error + " in file: " + fileNameForError + " on line number: " + lineNumber + " on line: " + line);
                                } catch (Exception ex) {

                                }
                            }
                        }
                    } else {
                        parameters.put("output_info", "compiled_code");
                        response = Ajax.doPost("http://closure-compiler.appspot.com/compile", 30000, 30000, parameters, null);
                        if (response.successful) {
                            jObject = new JSONObject(response.response);
                            return jObject.getString("compiledCode");
                        }
                    }
                } catch (JSONException ex) {
                    Logger.getLogger(JavascriptSetup.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            return null;
        } else {

            // This is where the optimized code will end up
            //com.google.javascript.jscomp.Compiler.setLoggingLevel(Level.INFO);
            com.google.javascript.jscomp.Compiler compiler = new com.google.javascript.jscomp.Compiler();
            CompilerOptions options = new CompilerOptions();
            CompilationLevel.SIMPLE_OPTIMIZATIONS.setOptionsForCompilationLevel(options);
            options.setEmitUseStrict(true);
            options.setWarningLevel(DiagnosticGroups.ES5_STRICT, CheckLevel.OFF);

            SourceFile extern = SourceFile.fromCode("externs.js",
                    "");
            SourceFile input = SourceFile.fromCode("input.js", js);
            Result result = compiler.compile(extern, input, options);
            for (JSError message : compiler.getWarnings()) {
                System.err.println("Warning message: " + message.toString());
            }

            for (JSError message : compiler.getErrors()) {
                System.err.println("Error message: " + message.toString());
            }
            MyConsole.out.println(result.success);
            return compiler.toSource();
        
    }

    private static Tuple<String, Integer> getFileNameForError(JSONObject jObject) throws JSONException {
        int lineno = jObject.getInt("lineno");
        for (Integer key : mapLineToFile.keySet()) {
            if (key > lineno) {
                return new Tuple<String, Integer>(mapLineToFile.get(key), key - lineno);
            }
        }
        return null;
    }

    private static void saveFile(String js, ServletContext servletContext, String typeString) throws FileNotFoundException, UnsupportedEncodingException, IOException {

        String webInfPath = servletContext.getRealPath("/");
        String fileName = Random.fileName() + typeString + ".js";
        File file = new File(webInfPath + "/scripts/generated/" + fileName);
        MyConsole.out.println(file.getPath());
        File directory = new File(webInfPath + "/scripts/generated/");
        PrintWriter writer = new PrintWriter(file, "UTF-8");
        writer.print(js);
        writer.close();
        String filePath = file.getPath();
        for (File f : directory.listFiles()) {
            String path = f.getPath();
            if (!path.equals(filePath) && path.contains(typeString)) {
                //f.delete();
            }
        }
        mapTypeStringToScriptFileName.put(typeString, "scripts/generated/" + fileName);
    }

    private static List<String> getJsFilePathsForPackages(List<String> packagePaths) throws UnsupportedEncodingException {
        List<String> list = new ArrayList<String>();
        for (String packagePath : packagePaths) {

            File directoryProjectFolder = new File(getProjectFolder());
            String directoryProjectFolderPath = directoryProjectFolder.getPath();
            File directory = new File(directoryProjectFolder + packagePath);
            for (File file : directory.listFiles()) {
                String filePath = file.getPath();
                if (file.isFile()) {
                    if (FilenameUtils.getExtension(filePath).toLowerCase().equals("js")) {
                        list.add(filePath.replace(directoryProjectFolderPath, "").replace("\\", "/"));
                    }
                }
            }
        }
        return list;
    }
 public static void clearScriptsList()throws UnsupportedEncodingException {
        
        Settings settings = new Settings(getProjectFolder() + "/MyWeb/scripts_list.bin");
        Map<String, List<String>> mapPageTypeToList =    new HashMap<String, List<String>>();
        settings.replaceOrAdd("map", mapPageTypeToList);
        settings.save();
 }
    public static List<String> getJsFilePathsInOrderOfDependancy(String rootScript, String type, InterfaceConfiguration interfaceConfiguration) throws UnsupportedEncodingException, Exception {
        
        Settings settings = new Settings(getProjectFolder() + "/MyWeb/scripts_list.bin");
        Map<String, List<String>> mapPageTypeToList = (Map<String, List<String>>)settings.getObject("map");
        if(mapPageTypeToList!=null)
        {
            if(mapPageTypeToList.get(type)!=null)
                return mapPageTypeToList.get(type);
        }
        else
            mapPageTypeToList= new HashMap<String, List<String>>();
        List<String> filePaths = getJsFilePathsForPackages(interfaceConfiguration.getJsPackages());
        JSHint jsHint = new JSHint();
        String options = "{ undef: true, maxerr: 10000 }";
        Map<String, String> mapGlobalToFilePath = new HashMap<String, String>();
        Map<String, List<String>> mapFilePathToRequired = new HashMap<String, List<String>>();
        JSHint.Result result = jsHint.lint(rootScript, options);
        List<String> required = new ArrayList<String>();
        for (JSHint.Error error : result.getErrors()) {
            if (error.getCode().toLowerCase().equals("w117")) {
                required.add(error.getA());
            }
        }
        mapFilePathToRequired.put("ROOTROOTROOT", required);
        List<String> filePathsToIgnore = interfaceConfiguration.getJsFilePathsToIgnore(type);
        for (String filePath : filePaths) {
            if (!filePathsToIgnore.contains(filePath)) {
               MyConsole.out.println(filePath);
                String source = getFileContent(filePath);
                result = jsHint.lint(source, options);
                required = new ArrayList<String>();
                for (JSHint.Error error : result.getErrors()) {
                    if (error.getCode().toLowerCase().equals("w117")) {
                        required.add(error.getA());
                    }
                }
                mapFilePathToRequired.put(filePath, required);
                for (String global : result.getGlobals()) {
                    mapGlobalToFilePath.put(global, filePath);
                }
            }
        }
        List<String> orderedPaths = new ArrayList<String>();
        List<String> found = new ArrayList<String>();
        orderedPaths.addAll(buildTreeDependancies(new ArrayList<String>(), mapGlobalToFilePath, mapFilePathToRequired, found, "ROOTROOTROOT"));
        orderedPaths.remove("ROOTROOTROOT");
        for (String orderedPath : orderedPaths) {
            MyConsole.out.println(orderedPath);
        }
        mapPageTypeToList.put(type, orderedPaths);
        settings.replaceOrAdd("map", mapPageTypeToList);
        settings.save();
        return orderedPaths;
    }

    private static Exception getCircularReferenceException(List<String> path, String currentFilePath) {
        int index = path.indexOf(currentFilePath);
        int length = path.size();
        StringBuffer sb = new StringBuffer();
        sb.append("circular reference found with files: ");
        boolean first = true;
        while (index < length) {
            if (first) {
                first = false;
            } else {
                sb.append(",");
            }
            sb.append(path.get(index));
            index++;
        }
        sb.append(".");
        return new Exception(sb.toString());
    }

    private static List<String> buildTreeDependancies(List<String> currentLinearDependancyPath, Map<String, String> mapGlobalToFilePath, Map<String, List<String>> mapFilePathToRequired, List<String> found, String currentFilePath) throws Exception {
        List<String> returns = new ArrayList<String>();
        if (!found.contains(currentFilePath)) {
            if (currentLinearDependancyPath.contains(currentFilePath)) {
                throw getCircularReferenceException(currentLinearDependancyPath, currentFilePath);
            }
            currentLinearDependancyPath.add(currentFilePath);
            List<String> required = mapFilePathToRequired.get(currentFilePath);
            List<String> newFilePaths = new ArrayList<String>();
            for (String require : required) {
                String filePath = mapGlobalToFilePath.get(require);
                if (filePath != null) {
                    if (!found.contains(filePath)) {
                        newFilePaths.add(filePath);
                    }
                }
            }
            for (String newFilePath : newFilePaths) {
                List<String> newCurrentLinearDependancyPath = new ArrayList<String>();
                newCurrentLinearDependancyPath.addAll(currentLinearDependancyPath);
                returns.addAll(buildTreeDependancies(newCurrentLinearDependancyPath, mapGlobalToFilePath, mapFilePathToRequired, found, newFilePath));
            }

            if (!found.contains(currentFilePath)) {
                found.add(currentFilePath);
                returns.add(currentFilePath);
            }
        }
        return returns;
    }

    public static String getCompleteChatJavaScript(String pointedToFileNameString, Boolean isDevelopmentMachine, InterfaceConfiguration interfaceConfiguration) throws FileNotFoundException, UnsupportedEncodingException {
        StringBuffer sb = new StringBuffer();
        String pageUrl = interfaceConfiguration.getPageUrl(isDevelopmentMachine);
        pageUrl += pageUrl.substring(pageUrl.length() - 2, pageUrl.length() - 1).equals('/') ? "" : "/";
        sb.append("window.isCors=true;window.thePageUrl='");
        sb.append(pageUrl);
        sb.append("';function loadAScript(name){var script = document.createElement('script');script.type='text/javascript';script.src=");
        sb.append("name;document.body.appendChild(script);}loadAScript('");
        sb.append(pageUrl);
        sb.append(pointedToFileNameString);
        sb.append("');");
        return sb.toString();
    }

    private static int countLines(String str) {
        String[] lines = str.split("\r\n|\r|\n");
        return lines.length;
    }

    static String convertStreamToString(java.io.InputStream is) {
        java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }
}
