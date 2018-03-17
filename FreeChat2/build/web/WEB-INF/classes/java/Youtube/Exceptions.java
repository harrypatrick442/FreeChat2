/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Youtube;

/**
 *
 * @author SoftwareEngineer
 */
public class Exceptions {

    public static class VideoUnavailablePlayer extends DownloadError {

        private static final long serialVersionUID = 10905065542230199L;

        public VideoUnavailablePlayer() {
            super("unavailable-player");
        }
    }

    public static class AgeException extends DownloadError {

        private static final long serialVersionUID = 1L;

        public AgeException() {
            super("Age restriction, account required");
        }
    }

    public static class PrivateVideoException extends DownloadError {

        private static final long serialVersionUID = 1L;

        public PrivateVideoException() {
            super("Private video");
        }

        public PrivateVideoException(String s) {
            super(s);
        }
    }

    public static class EmbeddingDisabled extends DownloadError {

        private static final long serialVersionUID = 1L;

        public EmbeddingDisabled() {
            super();
        }
    }

    public static class VideoDeleted extends DownloadError {

        private static final long serialVersionUID = 1L;

        public VideoDeleted(String msg) {
            super(msg);
        }

    }

    public static class PlayerException extends Exception {

        public PlayerException(String msg) {
            super(msg);
        }

    }

    public static class UrlEncodedFmtStreamException extends Exception {

        public UrlEncodedFmtStreamException(String msg) {
            super(msg);
        }

    }

}
