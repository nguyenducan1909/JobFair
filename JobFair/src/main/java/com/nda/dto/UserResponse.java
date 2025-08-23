package com.nda.dto;

public record UserResponse(
        Long id,
        String userName,
        String email,
        String avatarUrl,
        boolean emailVerified,
        String status
) {}
