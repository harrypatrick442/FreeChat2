/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package VideoDownloader.scripts;

/**
 *
 * @author SoftwareEngineer7
 */
import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncoderException;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.InputFormatException;
import java.io.File;

public class Conversion {

    public static void main(String[] args) {
        File source = new File("D:\\sadda.mp4");
        File target = new File("D:\\target2.mp3");
        AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setBitRate(new Integer(128000));
        audio.setChannels(new Integer(2));
        audio.setSamplingRate(new Integer(44100));
        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setFormat("mp3");
        attrs.setAudioAttributes(audio);
        Encoder encoder = new Encoder();
        try {
            encoder.encode(source, target, attrs);
        } catch (EncoderException e) {
// TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
