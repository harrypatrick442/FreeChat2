/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.IRoomUuidToUsers;
import Database.UUID;
import MySocket.IGetAsynchronousSender;
import MyWeb.StopWatch;
import Profiles.IDatabase;
import java.util.ArrayList;

public class PopularRooms {

    private static PopularRooms instance = new PopularRooms();
    private ArrayList<Room> sorted;
    private StopWatch stopWatch = new StopWatch();

    public ArrayList<Room> get(IDatabase iDatabase, IGetAsynchronousSender iGetAsynchronousSender) throws Exception {
        if (sorted == null || sorted.size() < 4 || stopWatch.get_ms() < 600000) {
            stopWatch.Reset();
            IRoomUuidToUsers iRoomUuidToUsersUuid = iDatabase.getRoomUuidToUsers();
            sorted = new ArrayList<Room>();
            for(UUID uuidRoom:iRoomUuidToUsersUuid.getNRoomsWithMostUsers(20)){
                sorted.add(new Room(uuidRoom, iGetAsynchronousSender));
            }
            if(sorted.size()<20)
            {
                for(UUID uuid : iDatabase.getRoomUuidToInfo().getNRooms(20-sorted.size()))
                    sorted.add(new Room(uuid, iGetAsynchronousSender));
            }
        }
        return sorted;
    }

    public static PopularRooms getInstance() {
        return instance;
    }
}