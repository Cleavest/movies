package gr.cleavest.webfluxfilmsdb.repository;

import gr.cleavest.webfluxfilmsdb.entity.ActorEntity;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

import java.util.Collection;

/**
 * @author Cleavest on 30/12/2024
 */
public interface ActorRepository extends R2dbcRepository<ActorEntity, Long> {
    Flux<ActorEntity> findByIdIn(Collection<Long> ids);
}
