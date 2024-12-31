package gr.cleavest.webfluxfilmsdb.service;

import gr.cleavest.webfluxfilmsdb.entity.ActorEntity;
import gr.cleavest.webfluxfilmsdb.entity.MovieActorEntity;
import gr.cleavest.webfluxfilmsdb.repository.ActorRepository;
import gr.cleavest.webfluxfilmsdb.repository.MovieActorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

/**
 * @author Cleavest on 30/12/2024
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class ActorService {

    private final ActorRepository actorRepository;
    private final MovieActorRepository movieActorRepository;

    public Flux<ActorEntity> getActorsByMovieId(Long movieId) {
        return movieActorRepository.findByFilmId(movieId)
                .map(MovieActorEntity::getActorId)
                .collectList()
                .flatMapMany(actorRepository::findByIdIn)
                .onErrorResume(error -> {
                    log.error("Error fetching actors for movie {}: {}", movieId, error.getMessage());
                    return Flux.empty();
                });
    }
}
