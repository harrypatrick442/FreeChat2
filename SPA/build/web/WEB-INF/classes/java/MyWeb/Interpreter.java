/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

import java.io.Serializable;
import org.json.JSONObject;
import MyWeb.Sessions.Session;
/**
 *
 * @author EngineeringStudent
 */
public abstract class Interpreter  implements Serializable{
    public abstract void interpret(JSONObject jObject, Session session) throws Exception;
    public abstract void close(Session session);
}
