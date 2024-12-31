package gr.cleavest.webfluxfilmsdb.rest;

import gr.cleavest.webfluxfilmsdb.dto.FilmDTO;
import gr.cleavest.webfluxfilmsdb.dto.SimpleDTO;
import gr.cleavest.webfluxfilmsdb.dto.UserDTO;
import gr.cleavest.webfluxfilmsdb.entity.ActorEntity;
import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import gr.cleavest.webfluxfilmsdb.mapper.FilmMapper;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import gr.cleavest.webfluxfilmsdb.service.ActorService;
import gr.cleavest.webfluxfilmsdb.service.FilmService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * @author Cleavest on 20/10/2024
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("api/movies")
public class FilmController {

    private final FilmService filmService;
    private final FilmMapper filmMapper;
    private final ActorService actorService;

    @GetMapping("/register")
    public Mono<FilmDTO> registerFilm(@RequestBody FilmDTO filmDTO) {
        FilmEntity filmEntity = filmMapper.map(filmDTO);
        return filmService.registerFilm(filmEntity).map(filmMapper::map);
    }

    @GetMapping("/{id}")
    public Mono<FilmEntity> getFilmInfo(@PathVariable("id") Long id) {
        return filmService.getFilmById(id);
    }

    @GetMapping("/all")
    public Flux<FilmEntity> getAllFilms() {
        return filmService.getAllFilms();
    }

    @GetMapping("/page")
    public Flux<FilmDTO> getFilms(@RequestBody SimpleDTO simple) {
        return filmService.getFilmsByPage(simple.getValue(), 20).map(filmMapper::map);
    }

    @GetMapping("/pages")
    public Flux<FilmDTO> getFilmss(@RequestParam(defaultValue = "0") Integer page) {
        return filmService.getFilmsByPage(page, 20).map(filmMapper::map);
    }

    @GetMapping("/search")
    public Flux<FilmEntity> searchMovies(@RequestParam(required = false) String query) {
        return filmService.searchMovies(query);
    }

    @GetMapping
    public Flux<FilmEntity> getAllMovies() {
        return filmService.getAllMovies();
    }

    @GetMapping("/{id}/actors")
    public Flux<ActorEntity> getMovieActors(@PathVariable Long id) {
        return actorService.getActorsByMovieId(id);
    }

}
