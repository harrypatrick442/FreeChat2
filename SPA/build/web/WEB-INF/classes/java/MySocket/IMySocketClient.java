/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MySocket;

import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer7
 */
  public interface IMySocketClient {
            public void onmessage(JSONObject jObject);
            public void onopen();
            public void onclose();
}
