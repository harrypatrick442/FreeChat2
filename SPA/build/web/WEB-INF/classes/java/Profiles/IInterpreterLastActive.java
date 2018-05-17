/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import MyWeb.Configuration;
import FreeChat2.Users;
import MyWeb.Interpreter;
import MySocket.AsynchronousSender;
import MyWeb.GuarbageWatch;
import MySocket.ISend;
import MyWeb.Ip;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public interface IInterpreterLastActive {
    public void sendActive() throws Exception;
}
