package com.nda.repo;

import com.nda.pojo.EmployerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Integer> {
    Optional<EmployerProfile> findByUserId(Long userId);
    Page<EmployerProfile> findByVerified(boolean verified, Pageable pageable);
}
