/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import FreeChat2.Room;
import FreeChat2.User;
import MyWeb.Tuple;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;



/**
 *
 * @author EngineeringStudent
 */
public interface IRoomUuidToUsers {
    public void add(UUID roomUuid, UUID userUuid, String endpoint) throws Exception;
    public void remove(UUID roomUuid, UUID userUuid) throws Exception;
    public ArrayList<Tuple<User, String>> get(UUID roomUuid) throws Exception;
    public String getEndpoint(UUID roomUuid, UUID userUuid) throws Exception;
    public int getNUsers(UUID roomUuid) throws Exception;
    public ArrayList<UUID> getNRoomsWithMostUsers(int nRooms) throws Exception;
}
