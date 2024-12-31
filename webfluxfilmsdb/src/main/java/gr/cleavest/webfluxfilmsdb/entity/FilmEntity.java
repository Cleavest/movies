package gr.cleavest.webfluxfilmsdb.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author Cleavest on 20/10/2024
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table("films")
public class FilmEntity {

    @Id
    private Long id;
    private String title;
    private String description;
    private String img;
    private String genre;
    private Integer directorId;
    private LocalDate releaseDate;
    private LocalDate createdAt;
}
