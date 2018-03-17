/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import Database.IInterests;
import Database.IUuidToAbout;
import Database.IUuidToLastActive;
import Database.IUuidToAuthenticationInfo;
import Database.IUuidToEmail;
import Database.IUuidToStatus;
import Database.IProfiles;
import Database.IUuidToBirthday;
import Database.IUuidToGender;
import Database.IUuidToImages;
import Database.IUuidToInterests;
import Database.IUuidToJoined;
import Database.IUuidToLocation;
import Database.IUuidToUsername;


/**
 *
 * @author EngineeringStudent
 */
public interface IDatabase {
    public IUuidToEmail getUuidToEmail();
    public IUuidToUsername getUuidToUsername();
    public IUuidToAuthenticationInfo getUuidToAuthenticationInfo();
    public IUuidToLastActive getUuidToLastActive();
    public IInterests getInterests();
    public IUuidToStatus getUuidToStatus();
    public IUuidToAbout getUuidToAbout();
    public IProfiles getProfiles();
    public IUuidToJoined getUuidToJoined();
    public IUuidToLocation getUuidToLocation();
    public IUuidToInterests getUuidToInterests();
    public IUuidToImages getUuidToImages();
    public IUuidToBirthday getUuidToBirthday();
    public IUuidToGender getUuidToGender();
}
