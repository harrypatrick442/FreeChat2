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
public interface IRoomUuidToAuthenticationInfo {
    public void set(UUID userUuid, AuthenticationInfo aI) throws Exception;
    public AuthenticationInfo get(UUID uuid) throws Exception;
    public void delete(UUID uuid) throws Exception;
}
