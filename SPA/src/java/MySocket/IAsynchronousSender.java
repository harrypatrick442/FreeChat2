/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public interface IAsynchronousSender {
    void send(JSONObject jObject, String name);
    void send(List<JSONObject> jObject, String name);
}
