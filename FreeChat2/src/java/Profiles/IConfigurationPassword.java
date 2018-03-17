/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import MyWeb.Configuration;
import MyWeb.Interpreter;
import MySocket.AsynchronousSender;
import MyWeb.GuarbageWatch;
import MySocket.ISend;
import MyWeb.Tuple;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public interface IConfigurationPassword {
    int getPasswordLengthMax();
    int getPasswordLengthMin();
    int getPasswordNSpecialMin();
    int getPasswordNCapitalMin();
}
