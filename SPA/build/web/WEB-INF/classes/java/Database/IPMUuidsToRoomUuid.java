/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Tuple;

/**
 *
 * @author EngineeringStudent
 */
public interface IPmUuidsToRoomUuid {
    public UUID getRoomUuid(UUID userUuid1, UUID userUuid2) throws Exception;
    public Tuple<UUID, UUID>getUserUuids(UUID roomUuid) throws Exception;
    public Boolean containsRoomUuid(UUID roomUuid) throws Exception ;
    public void add(UUID roomUuid, UUID userUuid1, UUID userUuid2) throws Exception;
}
