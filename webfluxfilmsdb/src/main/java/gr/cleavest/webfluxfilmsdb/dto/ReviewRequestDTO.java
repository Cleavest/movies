package gr.cleavest.webfluxfilmsdb.dto;

import lombok.Data;

/**
 * @author Cleavest on 4/11/2024
 */

@Data
public class ReviewRequestDTO {

    private Long id;
    private int rating;
    private String text;
}
