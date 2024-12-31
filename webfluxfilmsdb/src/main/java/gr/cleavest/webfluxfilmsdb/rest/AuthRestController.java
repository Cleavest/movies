package gr.cleavest.webfluxfilmsdb.rest;

import gr.cleavest.webfluxfilmsdb.dto.*;
import gr.cleavest.webfluxfilmsdb.entity.UserEntity;
import gr.cleavest.webfluxfilmsdb.exception.UnauthorizedException;
import gr.cleavest.webfluxfilmsdb.mapper.UserMapper;
import gr.cleavest.webfluxfilmsdb.security.CustomPrincipal;
import gr.cleavest.webfluxfilmsdb.security.JwtHandler;
import gr.cleavest.webfluxfilmsdb.security.SecurityService;
import gr.cleavest.webfluxfilmsdb.security.TokenDetails;
import gr.cleavest.webfluxfilmsdb.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.Cookie;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

/**
 * @author Cleavest on 20/10/2024
 */
@Slf4j
@CrossOrigin(maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthRestController {

    private final SecurityService securityService;
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public Mono<UserDTO> register(@RequestBody UserDTO dto) {
        UserEntity entity = userMapper.map(dto);
        return userService.registerUser(entity).map(userMapper::map);
    }

    @PostMapping("/login")
    public Mono<AuthResponseDTO> login(@RequestBody AuthRequestDTO dto) {
        return securityService.authenticate(dto.getUsername(), dto.getPassword())
                .flatMap(tokenDetails -> Mono.just(

                        AuthResponseDTO.builder()
                                .userId(tokenDetails.getUserId())
                                .token(tokenDetails.getToken())
                                .issuedAt(tokenDetails.getIssuedAt())
                                .expiresAt(tokenDetails.getExpiresAt())
                                .build()
                ));
    }

    @GetMapping("/me")
    public Mono<UserDTO> getUserInfo(Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();

        return userService.getUserById(customPrincipal.getId())
                .map(userMapper::map);
    }


}
