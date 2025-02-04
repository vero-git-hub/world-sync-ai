package org.example.worldsyncai.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.auth.JwtTokenFilter;
import org.example.worldsyncai.auth.JwtTokenProvider;
import org.example.worldsyncai.service.impl.SecretManagerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final SecretManagerService secretManagerService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        String backendAllowedOrigin;
        String frontendAllowedOrigin;
        try {
            backendAllowedOrigin = secretManagerService.getSecret("backend-allowed-origin");
            frontendAllowedOrigin = secretManagerService.getSecret("frontend-url");
            log.info("✅ Loaded CORS allowed origins: backend={}, frontend={}", backendAllowedOrigin, frontendAllowedOrigin);
        } catch (Exception e) {
            backendAllowedOrigin = "http://localhost:8080";
            frontendAllowedOrigin = "http://localhost:5173";
            log.warn("⚠️ Using fallback CORS origins: backend={}, frontend={}", backendAllowedOrigin, frontendAllowedOrigin);
        }

        final String finalBackendAllowedOrigin = backendAllowedOrigin;
        final String finalFrontendAllowedOrigin = frontendAllowedOrigin;

        http
                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        new AntPathRequestMatcher("/h2-console/**"),
                        new AntPathRequestMatcher("/api/**")
                ))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/css/**", "/images/**", "/js/**", "/public/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login", "/api/auth/register",
                                "/api/google/calendar/auth", "/api/google/calendar/callback",
                                "/api/google/calendar/check"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of(
                            finalFrontendAllowedOrigin,
                            finalBackendAllowedOrigin
                    ));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-CSRF-TOKEN"));
                    corsConfig.setExposedHeaders(List.of("Authorization"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter(jwtTokenProvider, userDetailsService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}