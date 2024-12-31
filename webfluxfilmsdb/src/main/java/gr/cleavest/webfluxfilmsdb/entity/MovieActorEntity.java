package gr.cleavest.webfluxfilmsdb.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

/**
 * @author Cleavest on 30/12/2024
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table("film_actors")
public class MovieActorEntity {
    @Id
    private Long id;
    private Long filmId;
    private Long actorId;
}
