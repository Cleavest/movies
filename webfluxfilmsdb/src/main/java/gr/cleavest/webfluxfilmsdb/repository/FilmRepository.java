package gr.cleavest.webfluxfilmsdb.repository;

import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 20/10/2024
 */
public interface FilmRepository extends R2dbcRepository<FilmEntity, Long> {

    Mono<FilmEntity> findByTitle(String title);

    @Query("SELECT * FROM films LIMIT :size OFFSET :offset")
    Flux<FilmEntity> findAllByPage(int size, int offset);

    Flux<FilmEntity> findByTitleContainingIgnoreCase(String title);

}
