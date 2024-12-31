package gr.cleavest.webfluxfilmsdb.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

/**
 * @author Cleavest on 20/11/2024
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class WatchListDTO {

    private Long userId;
    private Long filmId;

}
