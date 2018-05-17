/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.IRoomUuidToUsers;
import Profiles.IDatabase;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class PopularRoomsHelper {
    public static ArrayList<Room> getPopular(IDatabase iDatabase){
        ArrayList<Room> rooms = new ArrayList<Room>();
        //get top ten rooms with most users
        IRoomUuidToUsers iRoomUuidToUsersUuid = iDatabase.getRoomUuidToUsersUuid();
        ArrayList<Room> currentRoomsSortedPopularity = iDatabase.getNMostPopularRooms();
        return rooms;
    }
};
