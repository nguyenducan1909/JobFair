package com.nda.dto;

import jakarta.validation.constraints.*;

public record AuthRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
