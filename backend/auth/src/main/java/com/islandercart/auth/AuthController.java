package com.islandercart.auth;

import com.islandercart.auth.AuthRequest;
import com.islandercart.auth.AuthResponse;
import com.islandercart.auth.JwtUtil;
import com.islandercart.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.islandercart.auth.UserRepository; // Assuming you have a UserRepository for MongoDB
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository; // Inject UserRepository to fetch user data from DB

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            // Authenticate the user with email and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().strip(), request.getPassword().strip())
            );

            // Fetch the user details from the database based on the email
            Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(401).body(new AuthResponse("User not found"));
            }

            // Get the User object from the Optional
            User user = optionalUser.get();

            // Generate the JWT token with the User object
            String token = jwtUtil.generateToken(user);

            // Return the response with the JWT token
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception ex) {
            // If authentication fails, return unauthorized response
            return null;
        }
    }
}
