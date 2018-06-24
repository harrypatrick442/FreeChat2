/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import FreeChat2.Global;
import MyWeb.StopWatch;
import java.sql.Array;
import java.sql.Blob;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.NClob;
import java.sql.PreparedStatement;
import java.sql.SQLClientInfoException;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Savepoint;
import java.sql.Statement;
import java.sql.Struct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author EngineeringStudent
 */
public abstract class Table implements ISetup {

    public final IConnectionsPool iConnectionsPool;

    public Table(IConnectionsPool iConnectionsPool) {
        this.iConnectionsPool = iConnectionsPool;
    }

    @Override
    public abstract void createIfNotExists();

    protected Connection getConnection() throws SQLException {
        return iConnectionsPool.getConnection();
    }

}
