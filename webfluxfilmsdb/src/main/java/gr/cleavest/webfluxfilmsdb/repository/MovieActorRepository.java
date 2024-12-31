package gr.cleavest.webfluxfilmsdb.repository;

import gr.cleavest.webfluxfilmsdb.entity.MovieActorEntity;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

/**
 * @author Cleavest on 30/12/2024
 */
public interface MovieActorRepository extends R2dbcRepository<MovieActorEntity, Long> {
    Flux<MovieActorEntity> findByFilmId(Long movieId);
}
