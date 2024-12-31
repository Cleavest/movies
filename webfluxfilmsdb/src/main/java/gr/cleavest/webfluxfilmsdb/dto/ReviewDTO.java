package gr.cleavest.webfluxfilmsdb.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 28/10/2024
 */


@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ReviewDTO {

    private Long id;
    private Long userId;
    private String username;
    private Long filmId;
    private Integer rating;
    private String review_text;
    private LocalDateTime review_at;
}
