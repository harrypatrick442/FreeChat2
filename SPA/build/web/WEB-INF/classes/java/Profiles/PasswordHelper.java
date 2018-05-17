/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import FreeChat2.Users;

/**
 *
 * @author EngineeringStudent
 */
public class PasswordHelper {

    public static String isValid(String password, IConfigurationPassword iConfigurationPassword) {
        int upperCase = 0;
        int special = 0;
        int length = password.length();
        if (length < iConfigurationPassword.getPasswordLengthMin()) {
            return "Password is too short! Minimum length is " + iConfigurationPassword.getPasswordLengthMin() + " characters.";
        }

        if (length > iConfigurationPassword.getPasswordLengthMax()) {
            return "Password is too long! Maximum length is " + iConfigurationPassword.getPasswordLengthMax() + " characters.";
        }
        for (int i = 0; i < length; i++) {
            char c = password.charAt(i);
            if (Character.isUpperCase(c)) {
                upperCase++;
            }
            if (!Character.isDigit(c)) {
                special++;
            }
        }
        if (upperCase < iConfigurationPassword.getPasswordNCapitalMin()) {
            return "Password must contain at least "+iConfigurationPassword.getPasswordNCapitalMin()+" capital letter!";
        }
        if (special < iConfigurationPassword.getPasswordNSpecialMin()) {
            return "Password must contain at least "+iConfigurationPassword.getPasswordNSpecialMin()+" special character!";
        }
        return null;
    }
}
