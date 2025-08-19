package com.islandercart.users;

import com.islandercart.users.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // Get the Authorization header
        String authHeader = request.getHeader("Authorization");

        // If header is not null and starts with Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);  // Extract the JWT from the header
            if (jwtUtil.validateToken(jwt)) {
                String email = jwtUtil.extractEmail(jwt);  // Extract email from token
                String role = jwtUtil.extractRole(jwt);  // Extract role from token
                String id = jwtUtil.extractId(jwt);    // Extract user ID from token

                // Set the Authentication token with extracted user details
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        email, null, Collections.singletonList(() -> role) // Set role in authorities
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the Authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } else {
            // If no token is found, set a dummy guest authentication
            UsernamePasswordAuthenticationToken guestAuth = new UsernamePasswordAuthenticationToken(
                    "guest", null, Collections.singletonList(() -> "GUEST")
            );
            guestAuth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(guestAuth);
        }

        // Continue the filter chain
        chain.doFilter(request, response);
    }
}
