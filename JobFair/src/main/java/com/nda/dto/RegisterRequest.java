package com.nda.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50) String userName,
        @NotBlank @Email String email,

        // 6–25 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt
        @NotBlank
        @Size(min = 6, max = 25)
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,25}$",
                message = "Mật khẩu 6-25 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt"
        )
        String password,

        @NotBlank String confirmPassword,

        // URL avatar sau khi upload Cloudinary (hoặc để trống nếu backend tự xử lý)
        @NotBlank String avatarUrl
) {}
