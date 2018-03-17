/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.lang.NotImplementedException;
import org.apache.commons.lang.NullArgumentException;


/**
 *
 * @author EngineeringStudent
 */
public class AuthenticationInfo {
    private String hash;
    private String salt;
    public AuthenticationInfo(String hash, String salt)
    {
        if(salt==null||hash==null)
            throw new NullArgumentException("");
        this.hash=hash;
        this.salt=salt;
    }
    public String getHash()
    {
        return hash;
    }
    public String getSalt()
    {
        return salt;
    }
}
