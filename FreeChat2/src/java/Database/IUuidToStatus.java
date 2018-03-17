/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

/**
 *
 * @author EngineeringStudent
 */
public interface IUuidToStatus {
    public void addOrReplace(UUID u, String status) throws Exception;
    public String get(UUID u) throws Exception;
    public void delete(UUID u) throws Exception;
}
