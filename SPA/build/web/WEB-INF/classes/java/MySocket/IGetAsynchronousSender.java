/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MySocket;
import Database.UUID;
import MyWeb.Interpreter;


/**
 *
 * @author SoftwareEngineer7
 */
public interface IGetAsynchronousSender {
    public AsynchronousSender getAsynchronousSender(UUID userUuid, String endpoint);
}
