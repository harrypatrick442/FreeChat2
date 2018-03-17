/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import Database.UUID;


/**
 *
 * @author EngineeringStudent
 */
public class User {
    private UUID uuid;
    public User(UUID uuid)
    {
        this.uuid = uuid;    
    }
    public UUID getUuid()
    {
        return uuid;
    }
    public void signOut()
    {
        uuid=null;
    }
}
