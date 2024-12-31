package gr.cleavest.webfluxfilmsdb.service;

import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import gr.cleavest.webfluxfilmsdb.entity.WatchListEntity;
import gr.cleavest.webfluxfilmsdb.repository.FilmRepository;
import gr.cleavest.webfluxfilmsdb.repository.WatchListRepository;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 20/11/2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WatchListService {

    private final WatchListRepository watchListRepository;
    private final FilmRepository filmRepository;

    public Mono<Boolean> isFilmInWatchlist(Long userId, Long movieId) {
        return watchListRepository.existsByUserIdAndFilmId(userId, movieId);
    }

    public Mono<WatchListEntity> addToWatchlist(Long userId, Long filmId) {
        return isFilmInWatchlist(userId, filmId)
                .flatMap(exists -> {
                    if (!exists) {
                        WatchListEntity watchlist = new WatchListEntity();
                        watchlist.setUserId(userId);
                        watchlist.setFilmId(filmId);
                        return watchListRepository.save(watchlist);
                    }
                    return Mono.empty();
                });
    }

    public Mono<Void> removeFromWatchlist(Long userId, Long movieId) {
        return watchListRepository.deleteByUserIdAndFilmId(userId, movieId);
    }

    public Flux<FilmEntity> getWatchlistMovies(Long userId) {
        return watchListRepository.findByUserId(userId)
                .flatMap(watchlist ->
                        filmRepository.findById(watchlist.getFilmId())
                );
    }
}
