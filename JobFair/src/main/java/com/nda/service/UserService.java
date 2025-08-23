// src/main/java/com/nda/service/UserService.java
package com.nda.service;

import com.nda.dto.RegisterRequest;
import com.nda.dto.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest req);
}
