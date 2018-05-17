/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import MyWeb.Tuple;
import java.util.List;

/**
 *
 * @author EngineeringStudent
 */
public interface IRoomUuidToMessages {
    public List<Tuple<String, Long>> get(UUID roomUuid, long fromTimestamp, long toTimestamp) throws Exception;
    public List<String> getNMessages(UUID roomUuid, int nMessages) throws Exception;
    public void add(UUID roomUuid, UUID fromUuid, String message, long timestamp) throws Exception;
}
