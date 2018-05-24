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

    private String str;
    public UUID() {
        java.util.UUID uuid =  java.util.UUID.randomUUID();
        str = uuid.toString().replace("-", "").toLowerCase();
    }
    public UUID(String shortString)
    {
        str = shortString.toString().replace("-", "").toLowerCase();
    }
    @Override
    public String toString()
    {
        return str;
    }
    @Override
    public boolean equals(Object o) {

        if (o == this) return true;
        if (!(o instanceof UUID)) {
            return false;
        }
        UUID user = (UUID) o;
        return user.str.equals(str);
    }
    //Idea from effective Java : Item 9
    @Override
    public int hashCode() {
        int result = 17;
        result = 31 * result + str.hashCode();
        return result;
    }
}
