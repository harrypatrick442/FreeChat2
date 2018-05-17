/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Tuple;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;


/**
 *
 * @author EngineeringStudent
 */
public interface IUuidToImages {
public void add(UUID u, String relativePath) throws Exception;
public void delete(UUID u, String relativePath) throws Exception;
public void shiftLeft(UUID u, String relativePath) throws Exception;
public void shiftRight(UUID u, String relativePath) throws Exception;
public void setProfile(UUID u, String relativePath, boolean isProfile) throws Exception;
}
