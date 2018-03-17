/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import org.json.JSONObject;


/**
 *
 * @author EngineeringStudent
 */
public interface ISocket {
    void onopen();
    void onmessage(JSONObject jObject);
    void onclose();

    public void onerror(Exception ex);
}
