package gr.cleavest.webfluxfilmsdb.exception;

/**
 * @author Cleavest on 20/10/2024
 */
public class AuthException extends ApiException{
    public AuthException(String message, String errorCode) {
        super(message, errorCode);
    }
}
