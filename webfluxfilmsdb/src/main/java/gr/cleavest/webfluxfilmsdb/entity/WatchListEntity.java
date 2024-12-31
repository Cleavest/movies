package gr.cleavest.webfluxfilmsdb.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 20/11/2024
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table("watchlist")
public class WatchListEntity {

    @Id
    private Long id;
    private Long userId;
    private Long filmId;
    private LocalDateTime created_at;
}
