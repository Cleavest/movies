package gr.cleavest.webfluxfilmsdb.service;

import gr.cleavest.webfluxfilmsdb.entity.ActorEntity;
import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import gr.cleavest.webfluxfilmsdb.repository.FilmRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author Cleavest on 20/10/2024
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class FilmService {

    private final FilmRepository filmRepository;

    public Mono<FilmEntity> registerFilm(FilmEntity film) {
        return filmRepository.save(
                film.toBuilder()
                        .title(film.getTitle())
                        .genre(film.getGenre())
                        .description(film.getDescription())
                        .releaseDate(LocalDate.now())
                        .createdAt(LocalDate.now())
                        .build()
        ).doOnSuccess(u ->
                log.info("User registered: " + u)
        );
    }

    public Mono<FilmEntity> getFilmById(Long id) {
        return filmRepository.findById(id);
    }

    public Flux<FilmEntity> getAllFilms() {
        return filmRepository.findAll();
    }

    public Flux<FilmEntity> getFilmsByPage(long page, int size) {
        int offset = (int) (page * size);
        return filmRepository.findAllByPage(size, offset);
    }

    public Flux<FilmEntity> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return filmRepository.findAll();
        }
        return filmRepository.findByTitleContainingIgnoreCase(query.trim());
    }

    public Flux<FilmEntity> getAllMovies() {
        return filmRepository.findAll()
                .defaultIfEmpty(FilmEntity.builder()
                        .id(1L)
                        .title("Inception")
                        .description("A thief who steals corporate secrets through the use of dream-sharing technology.")
                        .img("https://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg")
                        .genre("Science Fiction")
                        .directorId(1)
                        .releaseDate(LocalDate.of(2010, 7, 16))
                        .createdAt(LocalDate.now())
                        .build())
                .onErrorResume(error -> {
                    log.error("Error fetching movies", error);
                    return Flux.empty();
                });
    }
}
