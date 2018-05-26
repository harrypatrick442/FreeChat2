/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb.Database;

import Database.ConnectionsPool;
import Database.IConnectionsPool;
import Database.IInterests;
import Database.ILobbyToUsers;
import Database.IPmUuidsToRoomUuid;
import Database.ISetup;
import Database.IUuidToAbout;
import Database.IUuidToAuthenticationInfo;
import Profiles.IDatabase;
import java.util.ArrayList;
import java.util.List;
import Database.IUuidToEmail;
import Database.IUuidToStatus;
import Database.IUuidToLastActive;
import Database.IProfiles;
import Database.IRoomUuidToAuthenticationInfo;
import Database.IRoomUuidToInfo;
import Database.IRoomUuidToMessages;
import Database.IRoomUuidToUsers;
import Database.IUserUuidToSession;
import Database.IUuidToBirthday;
import Database.IUuidToGender;
import Database.IUuidToImages;
import Database.IUuidToInterests;
import Database.IUuidToJoined;
import Database.IUuidToLocation;
import Database.IUuidToNotifications;
import Database.IUuidToUsername;
import MyWeb.MyConsole;
import java.util.Iterator;

/**
 *
 * @author EngineeringStudent
 */
public class Database implements IDatabase {

    private static Database instance = new Database();
    public static IDatabase getInstance(){
        return instance;
    }
    private IConnectionsPool iConnectionsPool;
    private TableUuidToEmail tableUuidToEmail;
    private TableUuidToUsername tableUuidToUsername;
    private TableUuidToAuthenticationInfo tableUuidToAuthenticationInfo;
    private TableUuidToLastActive tableUuidToLastActive;
    private TableUuidToAbout tableUuidToAbout;
    private TableUuidToStatus tableUuidToStatus;
    private TableUuidToInterests tableUuidToInterests;
    private TableInterests tableInterests;
    private TableProfiles tableProfiles;
    private TableUuidToJoined tableUuidToJoined;
    private TableUuidToLocation tableUuidToLocation;
    private TableUuidToImages tableUuidToImages;
    private TableUuidToBirthday tableUuidToBirthday;
    private TableUuidToGender tableUuidToGender;
    private TablePmUuidsToRoomUuid tablePmUuidsToRoomUuid;
    private TableRoomUuidToMessages tableRoomUuidToMessages;
    private TableRoomUuidToInfo tableRoomUuidToInfo;
    private TableRoomUuidToUsers tableRoomUuidToUsers;
    private TableRoomUuidToAuthenticationInfo tableRoomUuidToAuthenticationInfo;
    private TableUserUuidToSession tableUserUuidToSession;
    private TableLobbyToUsers tableLobbyToUsers;
    private TableUuidToNotifications tableUuidToNotifications;
    private List<ISetup> iSetups = new ArrayList<ISetup>();

    public Database() {
        String jdbcDriver = "org.gjt.mm.mysql.Driver";
        String dbUrl = "jdbc:mysql://localhost:3306/swingers";
        String user = "root";
        String password = "Afucka9";
        this.iConnectionsPool = new ConnectionsPool(jdbcDriver, dbUrl, user, password, 1, 10);
        tableUuidToEmail = new TableUuidToEmail(iConnectionsPool);
        iSetups.add(tableUuidToEmail);
        tableUuidToUsername = new TableUuidToUsername(iConnectionsPool);
        iSetups.add(tableUuidToUsername);
        tableUuidToAuthenticationInfo = new TableUuidToAuthenticationInfo(iConnectionsPool);
        iSetups.add(tableUuidToAuthenticationInfo);
        tableUuidToLastActive = new TableUuidToLastActive(iConnectionsPool);
        iSetups.add(tableUuidToLastActive);
        tableInterests = new TableInterests(iConnectionsPool);
        iSetups.add(tableInterests);
        tableUuidToAbout = new TableUuidToAbout(iConnectionsPool);
        iSetups.add(tableUuidToAbout);
        tableUuidToStatus = new TableUuidToStatus(iConnectionsPool);
        iSetups.add(tableUuidToStatus);
        tableProfiles = new TableProfiles(iConnectionsPool);
        iSetups.add(tableProfiles);
        tableUuidToJoined = new TableUuidToJoined(iConnectionsPool);
        iSetups.add(tableUuidToJoined);
        tableUuidToLocation = new TableUuidToLocation(iConnectionsPool);
        iSetups.add(tableUuidToLocation);
        tableUuidToInterests = new TableUuidToInterests(iConnectionsPool);
        iSetups.add(tableUuidToInterests);
        tableUuidToImages = new TableUuidToImages(iConnectionsPool);
        iSetups.add(tableUuidToImages);
        tableUuidToBirthday = new TableUuidToBirthday(iConnectionsPool);
        iSetups.add(tableUuidToBirthday);
        tableUuidToGender = new TableUuidToGender(iConnectionsPool);
        iSetups.add(tableUuidToGender);
        tablePmUuidsToRoomUuid = new TablePmUuidsToRoomUuid(iConnectionsPool);
        iSetups.add(tablePmUuidsToRoomUuid);
        tableRoomUuidToMessages = new TableRoomUuidToMessages(iConnectionsPool);
        iSetups.add(tableRoomUuidToMessages);
        tableRoomUuidToAuthenticationInfo = new TableRoomUuidToAuthenticationInfo(iConnectionsPool);
        iSetups.add(tableRoomUuidToAuthenticationInfo);
        tableRoomUuidToInfo= new TableRoomUuidToInfo(iConnectionsPool);
        iSetups.add(tableRoomUuidToInfo);
        tableUserUuidToSession = new TableUserUuidToSession(iConnectionsPool);
        iSetups.add(tableUserUuidToSession);
        tableRoomUuidToUsers = new TableRoomUuidToUsers(iConnectionsPool);
        iSetups.add(tableRoomUuidToUsers);
        tableLobbyToUsers = new TableLobbyToUsers(iConnectionsPool);
        iSetups.add(tableLobbyToUsers);
        tableUuidToNotifications = new TableUuidToNotifications(iConnectionsPool);
        iSetups.add(tableUuidToNotifications);
        Iterator<ISetup> iterator = iSetups.iterator();
        while (iterator.hasNext()) {
            ISetup iSetup = iterator.next();
            iSetup.createIfNotExists();
            MyConsole.out.println("Testing " + iSetup.getClass().getName() + ".");
            try {
                if (!iSetup.test()) {
                    MyConsole.out.println("Testing " + iSetup.getClass().getName() + " has failed without producing an exception!");
                }
            } catch (Exception ex) {
                MyConsole.out.println("Testing " + iSetup.getClass().getName() + " has failed!");
                ex.printStackTrace();
            }
        }
    }

    @Override
    public IUuidToNotifications getUuidToNotifications() {
        return tableUuidToNotifications;
    }
    
    @Override
    public IUuidToEmail getUuidToEmail() {
        return tableUuidToEmail;
    }

    @Override
    public IUuidToUsername getUuidToUsername() {
        return tableUuidToUsername;
    }

    @Override
    public IUuidToAuthenticationInfo getUuidToAuthenticationInfo() {
        return tableUuidToAuthenticationInfo;
    }

    @Override
    public IUuidToLastActive getUuidToLastActive() {
        return tableUuidToLastActive;
    }

    @Override
    public IInterests getInterests() {
        return tableInterests;
    }

    @Override
    public IUuidToStatus getUuidToStatus() {
        return tableUuidToStatus;
    }

    @Override
    public IUuidToAbout getUuidToAbout() {
        return tableUuidToAbout;
    }

    @Override
    public IProfiles getProfiles() {
        return tableProfiles;
    }

    @Override
    public IUuidToJoined getUuidToJoined() {
        return tableUuidToJoined;
    }

    @Override
    public IUuidToLocation getUuidToLocation() {
        return tableUuidToLocation;
    }

    @Override
    public IUuidToInterests getUuidToInterests() {
        return tableUuidToInterests;
    }

    @Override
    public IUuidToImages getUuidToImages() {
        return tableUuidToImages;
    }

    @Override
    public IUuidToBirthday getUuidToBirthday() {
        return tableUuidToBirthday;
    }

    @Override
    public IUuidToGender getUuidToGender() {
        return tableUuidToGender;
    }
    @Override
    public IRoomUuidToMessages getRoomUuidToMessages(){
        return tableRoomUuidToMessages;
    }
    @Override
    public IPmUuidsToRoomUuid getPmUuidsToRoomUuid(){
        return tablePmUuidsToRoomUuid;
    }
    @Override
    public IRoomUuidToInfo getRoomUuidToInfo(){
        return tableRoomUuidToInfo;
    }
    @Override
    public IRoomUuidToAuthenticationInfo getRoomUuidToAuthenticationInfo(){
        return tableRoomUuidToAuthenticationInfo;
    }
    @Override
    public IUserUuidToSession getUserUuidToSession(){
        return tableUserUuidToSession;
    }

    @Override
    public IRoomUuidToUsers getRoomUuidToUsers() {
        return tableRoomUuidToUsers;
    }
    @Override
    public ILobbyToUsers getLobbyToUsers(){
        return tableLobbyToUsers;
    }

}
