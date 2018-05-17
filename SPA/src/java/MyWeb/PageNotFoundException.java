package MyWeb;

public class PageNotFoundException extends Exception {

    public PageNotFoundException(String message) {
        super(message);
    }

    public PageNotFoundException() {
        super();
    }
}
