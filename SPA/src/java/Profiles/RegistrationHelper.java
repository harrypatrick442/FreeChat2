/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import Database.IUuidToEmail;
import Database.IUuidToUsername;
import Database.UUID;
import MyWeb.MyConsole;
import MyWeb.TimeOffset;

/**
 *
 * @author EngineeringStudent
 */
public class RegistrationHelper {

    public static Result register(String username, String email, String password, int day, int month, int year, IDatabase iDatabase, IConfigurationPassword iConfigurationPassword) {
        String failedMessage = null;
        try {
            failedMessage = UsernameHelper.isValid(username, iDatabase);
            if (failedMessage == null) {
                IUuidToUsername uuidToUsername = iDatabase.getUuidToUsername();
                if (null != uuidToUsername.getUuidFromUsername(username)) {
                    failedMessage = "Username is already taken !";
                } else {
                    if (!EmailHelper.isValid(email)) {
                        failedMessage = "Please enter a valid email!";
                    } else {
                        IUuidToEmail uuidToEmail = iDatabase.getUuidToEmail();
                        if (null != uuidToEmail.getUuidFromEmail(email)) {
                            failedMessage = "Email is already taken!";
                        } else {
                            System.out.println("a");
                            failedMessage = PasswordHelper.isValid(password, iConfigurationPassword);
                            if (failedMessage == null) {
                                UUID uuid = getUuid(uuidToEmail);
                                long millis = BirthdayHelper.getMillis(day, month, year);
                                failedMessage = BirthdayHelper.isValid(millis);
                                if (failedMessage == null) {
                                    uuidToEmail.addOrReplace(uuid, email);
                                    uuidToUsername.addOrReplace(uuid, username);
                                    iDatabase.getUuidToJoined().set(uuid, System.currentTimeMillis() - TimeOffset.get());
                                    iDatabase.getUuidToBirthday().addOrReplace(uuid, millis);
                                    User user = new User(uuid);
                                    AuthenticationHelper.setPassword(user, password, iDatabase, iConfigurationPassword);
                                    return new Result(true, user);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            failedMessage = "An undefined error occured!";
        }
        return new Result(false, failedMessage);
    }

    private static UUID getUuid(IUuidToEmail uuidToEmail) throws Exception {

        UUID uuid = new UUID();
        while (null != uuidToEmail.getEmailFromUuid(uuid)) {
            uuid = new UUID();
        }
        return uuid;
    }
}
