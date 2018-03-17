/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public interface InterfaceConfiguration {
    String getPageUrl(Boolean isDevelopmentMachine);
    List<String> getJsPackages();
    List<String> getJsFilePathsToIgnore(String pageType);
}
