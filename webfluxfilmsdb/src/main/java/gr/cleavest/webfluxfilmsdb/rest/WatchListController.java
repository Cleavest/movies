package gr.cleavest.webfluxfilmsdb.rest;

import gr.cleavest.webfluxfilmsdb.dto.WatchListResponseDTO;
import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import gr.cleavest.webfluxfilmsdb.mapper.WatchListMapper;
import gr.cleavest.webfluxfilmsdb.repository.WatchListRepository;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import gr.cleavest.webfluxfilmsdb.service.WatchListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 20/11/2024
 */

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/watchlist")
public class WatchListController {

    private final WatchListRepository watchListRepository;
    private final WatchListService watchListService;
    private final WatchListMapper mapper;

    @GetMapping("/check/{filmId}")
    public Mono<Boolean> checkWatchList(@PathVariable Long filmId, Authentication authentication){
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        return watchListService.isFilmInWatchlist(customPrincipal.getId(), filmId);
    }

    @PostMapping("/toggle/{filmId}")
    public Mono<WatchListResponseDTO> toggleWatchlist(@PathVariable Long filmId, Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        return watchListService.isFilmInWatchlist(customPrincipal.getId(), filmId)
                .flatMap(exists -> {
                    if (exists) {
                        return watchListService.removeFromWatchlist(customPrincipal.getId(), filmId)
                                .then(Mono.just(new WatchListResponseDTO(
                                        "Movie removed from watchlist",
                                        false
                                )));
                    } else {
                        return watchListService.addToWatchlist(customPrincipal.getId(), filmId)
                                .map(watchlist -> new WatchListResponseDTO(
                                        "Movie added to watchlist",
                                        true
                                ));
                    }
                })
                .onErrorResume(e -> {
                    e.printStackTrace();
                    return Mono.just(new WatchListResponseDTO(e.getMessage(),false));
                });


    }

    @GetMapping
    public Flux<FilmEntity> getWatchlist(Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();

        return watchListService.getWatchlistMovies(customPrincipal.getId());
    }
}
