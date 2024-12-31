package gr.cleavest.webfluxfilmsdb.service;

import gr.cleavest.webfluxfilmsdb.entity.UserEntity;
import gr.cleavest.webfluxfilmsdb.exception.AuthException;
import gr.cleavest.webfluxfilmsdb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 20/10/2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Mono<UserEntity> registerUser(UserEntity user) {
        return userRepository.save(
                user.toBuilder()
                        .password(passwordEncoder.encode(user.getPassword()))
                        .createdAt(LocalDateTime.now())
                        .build()
        ).doOnSuccess(u ->
                log.info("User registered: " + u)
        );
    }

    public Mono<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Mono<UserEntity> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
