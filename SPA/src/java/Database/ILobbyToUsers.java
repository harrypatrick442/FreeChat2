/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import FreeChat2.User;
import MyWeb.Tuple;
import java.util.ArrayList;



/**
 *
 * @author EngineeringStudent
 */
public interface ILobbyToUsers {
    public void add(UUID userUuid, String endpoint) throws Exception;
    public void remove(UUID userUuid) throws Exception;
    public ArrayList<Tuple<User, String>> get() throws Exception;
    public String getEndpoint(UUID userUuid) throws Exception;
    public int getNUsers() throws Exception;
    public void clear() throws Exception;
}
