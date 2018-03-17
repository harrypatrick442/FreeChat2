/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import FreeChat2.Users;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class SearchInfoException extends Exception {

    public SearchInfoException(String message) {
        super(message);
    }

    public SearchInfoException(String message, Throwable throwable) {
        super(message, throwable);
    }

}