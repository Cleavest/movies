package gr.cleavest.webfluxfilmsdb.service;

import gr.cleavest.webfluxfilmsdb.dto.ReviewRequestDTO;
import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import gr.cleavest.webfluxfilmsdb.entity.ReviewEntity;
import gr.cleavest.webfluxfilmsdb.repository.ReviewRepository;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 28/10/2024
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Flux<ReviewEntity> getReviewsByFilmIdAndPage(Long filmId, int page, int size) {
        int offset = page * size;
        return reviewRepository.findReviewByFilmAndPage(filmId, size, offset);
    }



    public Mono<ReviewEntity> saveReview(ReviewRequestDTO review, CustomPrincipal customPrincipal) {
        return reviewRepository.save(new ReviewEntity().toBuilder()
                        .userId(customPrincipal.getId())
                        .username(customPrincipal.getName())
                        .rating(review.getRating())
                        .review_text(review.getText())
                        .filmId(review.getId())
                        .created_at(LocalDateTime.now())
                .build());
    }

    public Mono<ReviewEntity> saveReview(ReviewEntity review, Long userId) {
        return reviewRepository.save(review.toBuilder()
                        .userId(userId)
                        .created_at(LocalDateTime.now())
                .build());
    }

    public Mono<Boolean> hasReview(Long filmId, Long userId) {
        return reviewRepository.existsByFilmIdAndUserId(filmId, userId);
    }
}
