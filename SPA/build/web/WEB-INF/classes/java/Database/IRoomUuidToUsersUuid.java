/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import FreeChat2.Room;
import FreeChat2.RoomInfo;
import FreeChat2.RoomType;
import java.util.Set;



/**
 *
 * @author EngineeringStudent
 */
public interface IRoomUuidToUsersUuid {
    public void add(UUID roomUuid, UUID userUuid) throws Exception;
    public void remove(UUID roomUuid, UUID userUuid) throws Exception;
    public Set<Room> get(UUID roomUuid) throws Exception;
}
