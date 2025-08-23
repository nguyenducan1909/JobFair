// src/main/java/com/nda/service/impl/UserServiceImpl.java
package com.nda.service.impl;

import com.nda.dto.RegisterRequest;
import com.nda.dto.UserResponse;
import com.nda.entity.AccountStatus;
import com.nda.entity.User;
import com.nda.repository.UserRepository;
import com.nda.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest req) {
        // 1) Kiểm tra confirm password
        if (!req.password().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu và xác nhận mật khẩu không trùng khớp.");
        }

        // 2) Check tồn tại username/email
        if (userRepo.existsByUserName(req.userName())) {
            throw new IllegalArgumentException("Tên người dùng đã tồn tại.");
        }
        if (userRepo.existsByEmail(req.email().toLowerCase())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        // 3) Băm mật khẩu
        String hash = passwordEncoder.encode(req.password());

        // 4) Tạo entity
        User user = User.builder()
                .userName(req.userName().trim())
                .email(req.email().trim().toLowerCase())
                .passwordHash(hash)
                .avatarUrl(req.avatarUrl())
                .emailVerified(false)
                .status(AccountStatus.ACTIVE)
                .build();

        // 5) Lưu
        User saved = userRepo.save(user);

        // 6) Trả response (không bao gồm password)
        return new UserResponse(
                saved.getId(),
                saved.getUserName(),
                saved.getEmail(),
                saved.getAvatarUrl(),
                saved.isEmailVerified(),
                saved.getStatus().name()
        );
    }
}
