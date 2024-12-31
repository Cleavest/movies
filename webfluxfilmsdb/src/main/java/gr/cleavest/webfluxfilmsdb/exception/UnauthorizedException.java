package gr.cleavest.webfluxfilmsdb.exception;

/**
 * @author Cleavest on 20/10/2024
 */
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends ApiException{
    public UnauthorizedException(String message) {
        super(message,"UNAUTHORIZED");
    }
}
