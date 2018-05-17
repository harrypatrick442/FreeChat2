/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package Youtube;

import java.util.List;

public interface IDownloader{
public void getHtml();
public void done(List<LinkInfo> listVideos, List<LinkInfo> listAudios, List<String> cookies, String title, String iconUrl);
public void failed(String message);
public void failed();
public void progress(String message);
}