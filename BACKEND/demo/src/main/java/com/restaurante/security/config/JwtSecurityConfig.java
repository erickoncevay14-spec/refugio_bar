package com.restaurante.security.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.restaurante.security.jwt.JwtAuthenticationEntryPoint;
import com.restaurante.security.jwt.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@org.springframework.core.annotation.Order(2) // Orden de precedencia menor (se aplica después)
public class JwtSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public JwtSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                // Rutas públicas - API de autenticación
                .requestMatchers("/api/auth/**", "/jwt-auth/**", "/api/public/**").permitAll()
                
                // WebSocket endpoints (sin autenticación)
                .requestMatchers("/ws/**").permitAll()
                
                // Rutas públicas - Páginas HTML (sin autenticación)
                .requestMatchers("/", "/login", "/registro", "/index", "/nosotros").permitAll()
                .requestMatchers("/productos", "/chelas", "/piscos", "/rones", "/tequilas", "/vinos", "/vodckas").permitAll()
                .requestMatchers("/admin", "/mozo", "/bartender").permitAll() // Páginas HTML de roles
                
                // Recursos estáticos (CSS, JS, imágenes)
                .requestMatchers("/css/**", "/js/**", "/img/**", "/favicon.ico").permitAll()
                
                // API de productos público (sin autenticación)
                .requestMatchers("/api/productos/**").permitAll()
                
                // API protegidas (requieren JWT)
                .requestMatchers("/api/pedidos/**").authenticated()
                .requestMatchers("/api/reservas/**").authenticated()
                .requestMatchers("/api/mesas/**").authenticated()
                .requestMatchers("/api/usuarios/**").authenticated()
                
                // Todas las demás rutas requieren autenticación JWT
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
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
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // En lugar de usar "*", especificamos los orígenes explícitamente
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Usar allowedOriginPatterns en vez de allowedOrigins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}