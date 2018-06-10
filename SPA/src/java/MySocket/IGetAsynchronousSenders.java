/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MySocket;
import Database.UUID;
import MyWeb.Interpreter;
import java.util.Set;


/**
 *
 * @author SoftwareEngineer7
 */
public interface IGetAsynchronousSenders {
    public AsynchronousSendersSet getAsynchronousSenders(UUID userUuid, String endpoint);
}
