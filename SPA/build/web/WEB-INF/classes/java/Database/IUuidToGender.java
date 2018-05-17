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
public interface IUuidToGender {
    public String getGenderFromUuid(UUID uuid) throws Exception;
    public void addOrReplace(UUID u, int gender) throws Exception ;
    public void delete(UUID u) throws Exception ;
}
