package MyWeb;

import Database.IConnectionsPool;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import MyWeb.MyConsole;

public class Proxies {

    private IConnectionsPool iConnectionsPool;

    public Proxies(IConnectionsPool iConnectionsPool) {
        this.iConnectionsPool = iConnectionsPool;
    }

    public Proxy getRandomProxy(boolean ssl) throws Exception {
        Proxy proxy = null;
        Connection con = null;
        Statement st = null;
        int tryCount = 0;
        MyConsole.out.println("outside");
        try {
            LocalDateTime date = LocalDateTime.now();
            date.plusMinutes(-30);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String sslWhere = "";
            if (ssl) {
                sslWhere = " AND https = 'yes' ";
            }
            con = iConnectionsPool.getConnection();
            while (tryCount < 22) {
                MyConsole.out.println(date == null);
                st = con.createStatement();
                ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM proxymity_proxies WHERE status = 'active' " + (date != null ? "AND lastactive>'" + formatter.format(date) + "' " : "") + sslWhere + " ORDER BY RAND() LIMIT 1");
                if (rs.next()) {
                    int count = rs.getInt(1);
                    if (count > 50 || date == null) {
                       MyConsole.out.println("inside it");
                        st.close();
                        st = con.createStatement();
                        rs = st.executeQuery("SELECT host,port,type FROM proxymity_proxies WHERE status = 'active' " + (date != null ? "AND lastactive>'" + formatter.format(date) + "' " : "") + sslWhere + " ORDER BY RAND() LIMIT 1");
                        if (rs.next()) {

                            String host = rs.getString(1);
                            String port = rs.getString(2);
                            String type = rs.getString(3);
                            return new Proxy(type.contains("http") ? Proxy.Type.HTTP : Proxy.Type.SOCKS, new InetSocketAddress(host, Integer.parseInt(port)));
                        }
                    }
                }
                st.close();
                if (tryCount < 6) {
                    date = date.plusMinutes(-30);
                } else {
                    if (tryCount < 12) {
                        date = date.plusHours(-1);
                    } else {
                        if (tryCount < 20) {
                            date = date.plusHours(-2);
                        } else {
                            date = null;
                        }
                    }
                }
                tryCount++;
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {

            try {
                if (st != null) {
                    st.close();
                }
            } catch (SQLException se) {
            }
            try {
                if (con != null) {
                    con.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }
        return null;
    }
}
