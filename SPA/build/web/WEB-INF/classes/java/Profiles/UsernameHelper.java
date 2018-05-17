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
public class UsernameHelper { 
    public static String isValid(String name, IDatabase iDatabase) throws Exception {
        int length = name.length();
        if (length > 20) {
            return "Username too long. Should be between 2 and 20 characters length!";
        } else {
            if (length < 2) {
                return "Username too short. Should be between 2 and 20 characters length!";
            } else {
                String lower = name.toLowerCase();
                if (!lower.contains("admin")) {
                    if (name.matches("^[a-zA-Z0-9_-]+$")) {
                        if (!Users.nameInUse(name, iDatabase)) {
                            return null;
                        } else {
                            return "Username already in use!";
                        }
                    } else {
                        return "Username was invalid! Username can contain characters a-z, A-Z, 0-9, '_' and '-' Only!";
                    }
                } else {
                    return "Username was invalid! This name is reserved!";
                }
            }
        }
    }
    }