/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;


/**
 *
 * @author EngineeringStudent
 */
public class RoomInfo {
    public final String name;
    public final Boolean passwordProtected;
    public final RoomType roomType;
    public RoomInfo(String name, Boolean passwordProtected, RoomType roomType){
        this.name = name;
        this.passwordProtected = passwordProtected;
        this.roomType = roomType;
    }
}
