/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import Database.UUID;
import org.apache.commons.validator.EmailValidator;


/**
 *
 * @author EngineeringStudent
 */
public class EmailHelper {
    public static boolean isValid(String email)
    {
        return EmailValidator.getInstance().isValid(email);
    }
}
