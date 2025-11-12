package com.example.demo.controllers;

import com.example.demo.dtos.JwtResponse;
import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.services.JwtService;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Validated
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UUID> create(@Valid @RequestBody UserDetailsDTO user) {
        UUID id = userService.insert(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body(id); // 201 + Location header
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
        // Dacă cererea ajunge aici, înseamnă că JwtAuthFilter a rulat
        // și a validat token-ul cu succes (altfel ar fi dat 401).
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
    public ResponseEntity<UUID> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) {
        UserDetailsDTO user = userService.findUserById(id);

        return ResponseEntity.ok(user);
    }

}
