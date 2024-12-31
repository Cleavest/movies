package gr.cleavest.webfluxfilmsdb.repository;

import gr.cleavest.webfluxfilmsdb.entity.WatchListEntity;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 20/11/2024
 */
public interface WatchListRepository extends R2dbcRepository<WatchListEntity, Long> {

    Mono<WatchListEntity> findByFilmIdAndUserId(Long filmId, Long userId);

    Flux<WatchListEntity> findByUserId(Long userId);

    @Query("""
        INSERT INTO watchlist (user_id, film_id, status)
        VALUES (:userId, :filmId, :status)
        ON CONFLICT (user_id, film_id)
        DO UPDATE SET status = EXCLUDED.status
    """)
    Mono<WatchListEntity> save(Long userId, Long filmId, String status);

    Mono<Boolean> existsByUserIdAndFilmId(Long userId, Long movieId);

    Mono<Void> deleteByUserIdAndFilmId(Long userId, Long movieId);
}
