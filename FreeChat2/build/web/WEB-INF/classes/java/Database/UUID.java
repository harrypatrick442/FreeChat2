/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

/**
 *
 * @author EngineeringStudent
 */
public class UUID{

    private String shortString;
    public UUID() {
        java.util.UUID uuid =  java.util.UUID.randomUUID();
        shortString = uuid.toString().replace("-", "");
    }
    public UUID(String shortString)
    {
        this.shortString = shortString;
    }
    public String getShortVersion()
    {
        return shortString;
    }
}
