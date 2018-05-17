/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

import Database.UUID;
import MyWeb.GuarbageWatch;
import MySocket.AsynchronousSender;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.WeakHashMap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
import Profiles.IDatabase;

public class RoomCreationException extends Exception {

    private String message;

    public RoomCreationException(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return message;
    }
}
