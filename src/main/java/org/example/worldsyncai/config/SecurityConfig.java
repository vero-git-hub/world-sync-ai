package org.example.worldsyncai.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers("/css/**", "/images/**", "/js/**", "/public/**").permitAll()
                            .requestMatchers("/login", "/register", "/register/**", "/h2-console/**").permitAll()
                            .anyRequest().authenticated();
                })
                .formLogin(form -> {
                    form
                            .loginPage("/login")
                            .defaultSuccessUrl("http://localhost:5173/", true)
                            .permitAll();
                })
                .logout(logout -> {
                    logout
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("http://localhost:5173/login")
                            .permitAll();
                })
                .csrf(csrf -> {
                    csrf.ignoringRequestMatchers("/h2-console/**");
                })
                .headers(headers -> {
                    headers.frameOptions(frameOptions -> frameOptions.sameOrigin());
                });

        return http.build();
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