package gr.cleavest.webfluxfilmsdb.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 20/10/2024
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table("reviews")
public class ReviewEntity {

    @Id
    private Long id;
    private Long userId;
    private String username;
    private Long filmId;
    private Integer rating;
    private String review_text;
    private LocalDateTime created_at;
}
