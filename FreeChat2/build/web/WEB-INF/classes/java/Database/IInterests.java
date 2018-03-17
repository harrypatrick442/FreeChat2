/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Tuple;
import java.util.List;


/**
 *
 * @author EngineeringStudent
 */
public interface IInterests {

    public List<Tuple<Integer, String>> getAll() throws Exception;

    public void add(Integer id, String  name) throws Exception ;

}
