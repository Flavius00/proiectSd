package com.example.demo.controllers;

import com.example.demo.dtos.JwtResponse;
import com.example.demo.dtos.RegisterRequest;
import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.services.AuthService;
import com.example.demo.services.JwtService;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Validated
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService, AuthService authService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);

        return ResponseEntity.ok(Collections.singletonMap("message", "User registered and sync started!"));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody UserDTO userDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())
        );

        final String token = jwtService.generateToken(userDto);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token is valid");
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> update(
            @PathVariable UUID id,
            @Valid @RequestBody UserDetailsDTO user
    ) {
        user.setId(id);
        userService.update(user);

        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        authService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) {
        UserDetailsDTO user = userService.findUserById(id);

        return ResponseEntity.ok(user);
    }

}
