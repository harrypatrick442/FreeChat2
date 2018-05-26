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
public interface IUuidToNotifications {
    public List<Notification> get(UUID userUuid) throws Exception;//returns rooms
    public void add(UUID userUuid, UUID roomUuid, UUID fromUuid) throws Exception;
    public void clear(UUID userUuid, UUID roomUuid) throws Exception;
}
