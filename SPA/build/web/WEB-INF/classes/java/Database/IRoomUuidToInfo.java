/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import FreeChat2.RoomInfo;
import FreeChat2.RoomType;
import java.util.List;



/**
 *
 * @author EngineeringStudent
 */
public interface IRoomUuidToInfo {
    public void add(UUID uuid , String name, String type, Boolean hasPassword) throws Exception;
    public void setName(UUID uuid, String name) throws Exception;
    public Boolean nameExists(String name) throws Exception;
    public RoomInfo get(UUID uuid) throws Exception;
    public UUID getUnusedUuid() throws Exception;
    public List<UUID> getNPublicRooms(int nRooms) throws Exception;
}
