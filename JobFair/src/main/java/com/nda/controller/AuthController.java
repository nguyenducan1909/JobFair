package com.nda.controller;

import com.nda.dto.*;
import com.nda.entity.*;
import com.nda.repository.UserRepository;
import com.nda.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    // Đăng ký (giống bản bạn đã có)
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (!req.password().equals(req.confirmPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu xác nhận không khớp"));
        }
        if (userRepo.existsByEmail(req.email().toLowerCase()))
            return ResponseEntity.badRequest().body(Map.of("error", "Email đã tồn tại"));
        if (userRepo.existsByUserName(req.userName()))
            return ResponseEntity.badRequest().body(Map.of("error", "Tên người dùng đã tồn tại"));

        String hash = passwordEncoder.encode(req.password());
        User u = User.builder()
                .userName(req.userName().trim())
                .email(req.email().trim().toLowerCase())
                .passwordHash(hash)
                .avatarUrl(req.avatarUrl())
                .emailVerified(false)
                .status(AccountStatus.ACTIVE)
                .roles(new HashSet<>(List.of(Role.USER)))
                .build();

        userRepo.save(u);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
    }

    // Đăng nhập -> trả Access + Refresh token
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        // xác thực username/password
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        // nạp user
        UserDetails user = userDetailsService.loadUserByUsername(req.email().toLowerCase());

        // extra claims (vd roles)
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getAuthorities().stream().map(Object::toString).toArray());

        String access = jwtService.generateAccessToken(user, claims);
        String refresh = jwtService.generateRefreshToken(user);

        // expiresIn = access-exp-minutes * 60 (khớp với application.yml)
        long expiresIn = 60L * 60L;

        return ResponseEntity.ok(new AuthResponse("Bearer", access, refresh, expiresIn));
    }

    // Refresh -> cấp access token mới
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String username;
        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }

        UserDetails user = userDetailsService.loadUserByUsername(username);
        if (!jwtService.isTokenValid(refreshToken, user)) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getAuthorities().stream().map(Object::toString).toArray());
        String newAccess = jwtService.generateAccessToken(user, claims);

        long expiresIn = 60L * 60L; // 60 phút (tuỳ config)
        return ResponseEntity.ok(new AuthResponse("Bearer", newAccess, refreshToken, expiresIn));
    }
}
