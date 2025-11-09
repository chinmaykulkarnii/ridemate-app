package com.ridemate.config;

import com.ridemate.security.JwtAuthenticationFilter;
import com.ridemate.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    // This class/method defines how Spring Security will secure your application
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS so the frontend (like React from localhost:3000) can access APIs
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF because this is a stateless REST API using JWT (no session/cookies)
                .csrf(csrf -> csrf.disable())
                // Set session management to stateless because we rely on JWT, not HTTP sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define which routes are secured and which are open to public
                .authorizeHttpRequests(auth -> auth
                        // Allow public access to authentication-related endpoints (login, register, etc.)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Allow public access to WebSocket endpoints (if using STOMP/WebSocket)
                        .requestMatchers("/ws/**").permitAll()
                        // Any other request must be authenticated (must have valid JWT)
                        .anyRequest().authenticated()
                )
                // Use custom authentication provider (uses UserDetailsService + PasswordEncoder)
                .authenticationProvider(authenticationProvider())
                // Add custom JWT filter before UsernamePasswordAuthenticationFilter
                // This filter checks the Authorization header for JWT and validates it
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        // Build and return the configured SecurityFilterChain object
        return http.build();
    }
    // This bean defines Cross-Origin Resource Sharing (CORS) configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from React frontend running on localhost:3000
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // Allow the following HTTP methods from the frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers (like Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Allow sending credentials (like cookies or Authorization headers) with requests
        configuration.setAllowCredentials(true);
        // Register the configuration to apply to all routes in the backend
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to all backend endpoints
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}