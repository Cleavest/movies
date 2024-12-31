package gr.cleavest.webfluxfilmsdb.config;

import gr.cleavest.webfluxfilmsdb.security.AuthenticationManager;
import gr.cleavest.webfluxfilmsdb.security.BearerTokenServerAuthenticationConverter;
import gr.cleavest.webfluxfilmsdb.security.JwtHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import reactor.core.publisher.Mono;

/**
 * @author Cleavest on 20/10/2024
 */

@Slf4j
@Configuration
@EnableReactiveMethodSecurity
@EnableWebFluxSecurity
public class WebSecurityConfig {

    @Value("${jwt.secret}")
    private String secret;

    private final String [] publicRoutes = {"/api/auth/register", "/api/auth/login", "/api/auth/refresh"};

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http, AuthenticationManager authenticationManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(corsSpec -> corsSpec.configurationSource(s -> {
                    CorsConfiguration cors = new CorsConfiguration();
                    cors.addAllowedOrigin("http://localhost:3000");
                    cors.addAllowedMethod(HttpMethod.GET);
                    cors.addAllowedMethod(HttpMethod.POST);
                    cors.addAllowedMethod(HttpMethod.PUT);
                    cors.addAllowedMethod(HttpMethod.DELETE);
                    cors.addAllowedHeader("*");
                    cors.setAllowCredentials(true);
                    return cors;
                }))
                .authorizeExchange(exchange -> {
                    exchange.pathMatchers(HttpMethod.OPTIONS).permitAll();
                    exchange.pathMatchers(publicRoutes).permitAll();
                    exchange.anyExchange().authenticated();
                })
                .exceptionHandling(exchange -> {
                    exchange.authenticationEntryPoint((swe , e) -> {
                        log.error("In SecurityFilterChain unauthorized error {}", e.getMessage());
                        return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED));
                    });
                    exchange.accessDeniedHandler((swe , e) -> {
                        log.error("In SecurityFilterChain access denied {}", e.getMessage());
                        return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN));
                    });
                })
                .addFilterAt(bearerAuthenticationFilter(authenticationManager), SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }

    private AuthenticationWebFilter bearerAuthenticationFilter(AuthenticationManager authenticationManager) {
        AuthenticationWebFilter bearerAuthenticationFilter = new AuthenticationWebFilter(authenticationManager);
        bearerAuthenticationFilter.setServerAuthenticationConverter(
                new BearerTokenServerAuthenticationConverter(new JwtHandler(secret))
        );

        bearerAuthenticationFilter.setRequiresAuthenticationMatcher(
                exchange -> {
                    String path = exchange.getRequest().getPath().value();
                    // Έλεγχος αν το path είναι στα publicRoutes
                    for (String publicRoute : publicRoutes) {
                        if (path.startsWith(publicRoute)) {
                            return ServerWebExchangeMatcher.MatchResult.notMatch();
                        }
                    }
                    return ServerWebExchangeMatcher.MatchResult.match();
                }
        );

        return bearerAuthenticationFilter;
    }
}
