package gr.cleavest.webfluxfilmsdb.repository;

import gr.cleavest.webfluxfilmsdb.entity.ReviewEntity;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 28/10/2024
 */
public interface ReviewRepository extends R2dbcRepository<ReviewEntity, Long> {

    @Query("SELECT * FROM reviews WHERE reviews.film_id = :film LIMIT :size OFFSET :offset")
    Flux<ReviewEntity> findReviewByFilmAndPage(long film, int size, int offset);

    Mono<Boolean> existsByFilmIdAndUserId(long filmId, long userId);
}
