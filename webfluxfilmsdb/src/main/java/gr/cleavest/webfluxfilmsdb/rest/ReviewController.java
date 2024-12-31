package gr.cleavest.webfluxfilmsdb.rest;

import gr.cleavest.webfluxfilmsdb.dto.*;
import gr.cleavest.webfluxfilmsdb.entity.ReviewEntity;
import gr.cleavest.webfluxfilmsdb.entity.UserEntity;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import gr.cleavest.webfluxfilmsdb.service.ReviewService;
import gr.cleavest.webfluxfilmsdb.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * @author Cleavest on 28/10/2024
 */

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/film/{id}")
    public Flux<ReviewEntity> getReviews(@RequestParam(defaultValue = "0") Integer page, @PathVariable("id") Long id) {
        return reviewService.getReviewsByFilmIdAndPage(id, page, 20);
    }

    @PostMapping("/add")
    public Mono<ReviewEntity> addReview(@RequestBody ReviewRequestDTO review, Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        return reviewService.saveReview(review, customPrincipal);
    }

    @PostMapping("/has")
    public Mono<Map<String, Boolean>> hasReviews(@RequestBody SimpleDTO simpleDTO, Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        return reviewService.hasReview(simpleDTO.getValue(), customPrincipal.getId()).map(exists -> Map.of("exists", exists));
    }

    @PostMapping
    public Mono<ReviewEntity> createReview(@RequestBody ReviewEntity review, Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        Long userId = customPrincipal.getId();
        return reviewService.saveReview(review, userId);
    }
}
