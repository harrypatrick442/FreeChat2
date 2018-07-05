/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.util.List;


/**
 *
 * @author EngineeringStudent
 */
public interface IUserUuidToSession {
    public UUID get(UUID sessionUuid) throws Exception;
    public void map(UUID sessionUuid, UUID userUuid) throws Exception;
    public void delete(UUID sessionUuid) throws Exception;
    public List<UUID> getAllOnlineUserUuids() throws Exception;
    public boolean getIsLastSession(UUID userUuid, UUID sessionUuid) throws Exception;
}
