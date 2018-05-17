/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package Youtube;

import Youtube.AudioFileInfoBuffer.Info;

/**
 *
 * @author SoftwareEngineer7
 */
public interface IAudioFileInfoBuffer {
    public void storeReferenceForLifetime(Info info);
}
