/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MyWeb;

import MyWeb.Ajax.IPMode;
import java.net.CookieManager;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 *
 * @author SoftwareEngineer
 */
public interface IGetHtml{
    public String getHtml(URL url, CookieManager cookieManager, Boolean useProxy, AtomicBoolean stop, IPMode iPMode)throws PageNotFoundException,MalformedURLException;
}