/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Configuration;


/**
 *
 * @author EngineeringStudent
 */
public interface IUuidToUsername {
    public String getUsernameFromUuid(UUID uuid) throws Exception;
    public UUID getUuidFromUsername(String username) throws Exception ;
    public void addOrReplace(UUID u, String username) throws Exception ;
    public void delete(UUID u) throws Exception ;
    public void delete(String username) throws Exception;
    public Boolean exists(String name) throws Exception;
}
