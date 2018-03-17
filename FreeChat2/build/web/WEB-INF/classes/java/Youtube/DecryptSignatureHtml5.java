/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

import MyWeb.Ajax;
import MyWeb.Ajax.IPMode;
import MyWeb.GuarbageWatch;
import MyWeb.IGetHtml;
import MyWeb.PageNotFoundException;
import MyWeb.MyConsole;
import java.net.CookieManager;
import java.net.MalformedURLException;
import java.net.URI;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 *
 * @author SoftwareEngineer
 */
// thanks to @github.com/chberger
public class DecryptSignatureHtml5 {

    public URI playerURI;
    private IGetHtml iGetHtml;
    private CookieManager cookieManager;
    public static ConcurrentMap<String, InvocableInfo> mapUrlToInvocableInfo = new ConcurrentHashMap<String, InvocableInfo>();

    public DecryptSignatureHtml5(CookieManager cookieManager, URI playerURI, IGetHtml iGetHtml) {
        
            GuarbageWatch.add(this);
        this.playerURI = playerURI;
        this.iGetHtml = iGetHtml;
        this.cookieManager = cookieManager;
    }

    public String getHtml5PlayerScript(final AtomicBoolean stop) throws PageNotFoundException {
        try {
            return iGetHtml.getHtml(playerURI.toURL(), cookieManager, false, stop, IPMode.Any);//getHtmlxxx
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }
    private static String[] patternsDecodeFunctionName = {"signature(?:\\\",|=)([a-zA-Z0-9$]+)*\\((?:[a-zA-Z0-9$\\.]+)*\\)",
        "\\.sig\\|\\|([a-zA-Z0-9$]+)\\("};

    public String getMainDecodeFunctionName(String playerJS, AtomicBoolean stop) throws PageNotFoundException {

        for (String patternDecodeFunctionName : patternsDecodeFunctionName) {
            Pattern pattern = Pattern.compile(patternDecodeFunctionName);
            Matcher decodeFunctionNameMatch = pattern.matcher(playerJS);
            if (decodeFunctionNameMatch.find()) {
                MyConsole.out.println("decodeFunctionName is: " + decodeFunctionNameMatch.group(1));

                return decodeFunctionNameMatch.group(1);
            }
        }
        return null;
    }

    public String extractDecodeFunctions(AtomicBoolean stop, String functionName) throws PageNotFoundException {
        System.out.println(functionName);
        StringBuilder decodeScript = new StringBuilder();
        Pattern decodeFunction = Pattern
                // this will probably change from version to version so
                // changes have to be done here
                .compile(String.format("(%s=function\\([a-zA-Z0-9$]+\\)\\{.*?\\})[,;]", functionName),
                        Pattern.DOTALL);
        String playerJS = getHtml5PlayerScript(stop);
        Matcher decodeFunctionMatch = decodeFunction.matcher(playerJS);
        if (decodeFunctionMatch.find()) {
            decodeScript.append(decodeFunctionMatch.group(1)).append(';');
        } else {
            throw new DownloadError("Unable to extract the main decode function!");
        }

        Pattern decodeFunctionHelperName = Pattern.compile("\\);([a-zA-Z0-9]+)\\.");
        Matcher decodeFunctionHelperNameMatch = decodeFunctionHelperName.matcher(decodeScript.toString());
        if (decodeFunctionHelperNameMatch.find()) {
            final String decodeFuncHelperName = decodeFunctionHelperNameMatch.group(1);
            Pattern decodeFunctionHelper = Pattern.compile(
                    String.format("(var %s=\\{[a-zA-Z0-9]*:function\\(.*?\\};)", decodeFuncHelperName),
                    Pattern.DOTALL);
            Matcher decodeFunctionHelperMatch = decodeFunctionHelper.matcher(playerJS);
            if (decodeFunctionHelperMatch.find()) {
                decodeScript.append(decodeFunctionHelperMatch.group(1));
            } else {
                throw new DownloadError("Unable to extract the helper decode functions!");
            }

        } else {
            throw new DownloadError("Unable to determine the name of the helper decode function!");
        }
        return decodeScript.toString();
    }

    class InvocableDispensor {

        private AtomicBoolean stop;
        private InvocableInfo invocableInfo;

        public InvocableDispensor(AtomicBoolean stop) {
            this.stop = stop;
        }

        public InvocableInfo get() throws PageNotFoundException {
            InvocableInfo previus = mapUrlToInvocableInfo.get(playerURI.toString());
            if (previus != null) {
                return previus;
            }
            String playerJS = getHtml5PlayerScript(stop);
            String functionName = getMainDecodeFunctionName(playerJS, stop);
            final String decodeScript = extractDecodeFunctions(stop, functionName);
            ScriptEngineManager manager = new ScriptEngineManager();
            ScriptEngine engine = manager.getEngineByName("JavaScript");
            try {
                engine.eval(decodeScript);
                Invocable invocable = (Invocable) engine;
                invocableInfo = new InvocableInfo(invocable, functionName);
                return invocableInfo;
            } catch (Exception e) {
                throw new DownloadError("Unable to decrypt signature!");
            }
        }

        public void save() {
            if (invocableInfo != null) {
                mapUrlToInvocableInfo.put(playerURI.toString(), invocableInfo);
            }
        }
    ;

    }
 class InvocableInfo {

        public String functionName;
        public Invocable invocable;

        public InvocableInfo(Invocable invocable, String functionName) {
            this.functionName = functionName;
            this.invocable = invocable;
        }
    }

    public String decrypt(AtomicBoolean stop, String sig) {
        // use a js script engine
        try {
            InvocableDispensor invocableDispensor = new InvocableDispensor(stop);
            InvocableInfo invocableInfo = invocableDispensor.get();
            System.out.println(sig);
            String decrypted = (String) invocableInfo.invocable.invokeFunction(invocableInfo.functionName, sig);
            invocableDispensor.save();
            return decrypted;
        } catch (Exception e) {
            e.printStackTrace();
            throw new DownloadError("Unable to decrypt signature!");
        }

    }
}
