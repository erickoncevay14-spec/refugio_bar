package com.restaurante.security.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenManager jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenManager jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // Este método se ejecuta para cada solicitud entrante
    @Override
    protected void doFilterInternal(
            HttpServletRequest request, 
            HttpServletResponse response, 
            FilterChain filterChain)
            throws ServletException, IOException {
        
        // Excluir rutas públicas del filtro JWT
        String path = request.getRequestURI();
        if (path.startsWith("/jwt-auth/") || 
            path.startsWith("/api/auth/") || 
            path.startsWith("/ws/") ||
            path.startsWith("/css/") ||
            path.startsWith("/js/") ||
            path.startsWith("/img/") ||
            path.startsWith("/api/productos/") ||
            path.equals("/") ||
            path.equals("/login") ||
            path.equals("/registro") ||
            path.equals("/index") ||
            path.equals("/nosotros") ||
            path.equals("/productos") ||
            path.equals("/admin") ||
            path.equals("/mozo") ||
            path.equals("/bartender")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                // Validar que el token no esté vacío y tenga el formato correcto
                if (jwt.isEmpty() || jwt.split("\\.").length != 3) {
                    logger.error(" Token JWT malformado. Longitud: " + jwt.length() + 
                               ", Partes: " + jwt.split("\\.").length);
                    filterChain.doFilter(request, response);
                    return;
                }
                
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error(" Error al procesar el token JWT: " + e.getMessage());
                logger.error("Token recibido (primeros 20 chars): " + 
                           (jwt != null && jwt.length() > 20 ? jwt.substring(0, 20) + "..." : jwt));
            }
        }

        // Validar el token y configurar la autenticación en el contexto de seguridad
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}