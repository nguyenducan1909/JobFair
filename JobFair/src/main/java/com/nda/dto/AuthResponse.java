package com.nda.dto;

public record AuthResponse(
        String tokenType,     // "Bearer"
        String accessToken,
        String refreshToken,
        long   expiresIn      // seconds
) {}
