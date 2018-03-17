/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import Database.AuthenticationInfo;
import Database.UUID;
import MyWeb.Tuple;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author EngineeringStudent
 */
public class AuthenticationHelper {

    public static Result<Tuple<User, String>> authenticate(String usernameOrEmail, String password, IDatabase iDatabase) throws Exception {
        UUID uuid = iDatabase.getUuidToUsername().getUuidFromUsername(usernameOrEmail);
        String username = usernameOrEmail;
        if (uuid == null) {
            username = null;
            uuid = iDatabase.getUuidToEmail().getUuidFromEmail(usernameOrEmail);
        }
        if (uuid != null) {
            AuthenticationInfo aI = iDatabase.getUuidToAuthenticationInfo().getAuthenticationInfoFromUuid(uuid);
            if (aI != null) {
                if (BCrypt.checkpw(password, aI.getHash())) {
                    if (username == null) {
                        username = iDatabase.getUuidToUsername().getUsernameFromUuid(uuid);
                    }
                    return new Result(true, new Tuple<User, String>(new User(uuid), username));
                }
            }
        }
        return new Result(false, "The username/email or password was incorrect");
    }

    public static void resetPassword(String email, IDatabase iDatabase) throws Exception {
        StringBuffer sb = new StringBuffer();
        sb.append("");
        //Email email = new Email("brightonswingers@gmail.com", email, "Reset Password", "");
    }

    public static void signOut(User user, IDatabase iDatabase) {
        user.signOut();
    }

    public static Result setPassword(User user, String password, IDatabase iDatabase, IConfigurationPassword iConfigurationPassword) throws Exception {
        String passwordInvalidReason = PasswordHelper.isValid(password, iConfigurationPassword);
        if (passwordInvalidReason != null) {
            return new Result(false, passwordInvalidReason);
        }
        String s = BCrypt.gensalt(12);
        String h = BCrypt.hashpw(password, s);
        AuthenticationInfo aI = new AuthenticationInfo(h, s);
        iDatabase.getUuidToAuthenticationInfo().addOrReplace(user.getUuid(), aI);
        return new Result(true);
    }

}
