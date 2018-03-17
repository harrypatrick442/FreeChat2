/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package MySocket;
import MyWeb.Interpreter;


/**
 *
 * @author SoftwareEngineer7
 */
public interface IGetInterpreter {
    public Interpreter getInstance(MySocket MySocket, String className, String name, Enums.Type type);
}
