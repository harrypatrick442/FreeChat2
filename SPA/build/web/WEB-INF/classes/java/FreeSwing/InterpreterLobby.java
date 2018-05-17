/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeSwing;

import MyWeb.Interpreter;
import MyWeb.GuarbageWatch;
import MySocket.AsynchronousSender;
import MySocket.IGetInterpreter;
import MySocket.MySocket;
import MyWeb.Sessions.Session;
import Profiles.IInterpreterAuthentication;
import Profiles.InterpreterProfiles;
import Profiles.User;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterLobby extends Interpreter implements IInterpreterAuthentication {

    public AsynchronousSender asynchronousSender;
    private InterpreterProfiles interpreterProfiles;
    private User user;

    public InterpreterLobby(AsynchronousSender asynchronousSender) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
    }

    public void interpret(JSONObject jObject, Session session) throws Exception {
        interpreterProfiles.interpret(jObject, session);
    }

    @Override
    public void close() {
    }

    @Override
    public void preSendAuthenticationReply(String username, Boolean successful, User user) throws Exception {
    }

    @Override
    public void postSendAuthenticationReply(Boolean successful, JSONObject jObjectReply) throws Exception {
    }

}
