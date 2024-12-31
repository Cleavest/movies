package gr.cleavest.webfluxfilmsdb.exception;

/**
 * @author Cleavest on 20/10/2024
 */
import lombok.Getter;

public class ApiException extends RuntimeException {

    @Getter
    protected String errorCode;

    public ApiException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}