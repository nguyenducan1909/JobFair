// src/main/java/com/nda/entity/User.java
package com.nda.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name="uk_users_username", columnNames="userName"),
                @UniqueConstraint(name="uk_users_email", columnNames="email")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min=3, max=50)
    @Column(nullable=false, length=50)
    private String userName;

    @NotBlank @Email
    @Column(nullable=false, length=120)
    private String email;

    @NotBlank
    @Column(nullable=false, length=255)
    private String passwordHash;

    @Column(length=512)
    private String avatarUrl;

    @Column(nullable=false)
    private boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=20)
    private AccountStatus status = AccountStatus.ACTIVE;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    private Set<Role> roles = new HashSet<>();

    @PrePersist @PreUpdate
    private void normalize() {
        if (email != null) email = email.trim().toLowerCase();
        if (userName != null) userName = userName.trim();
        if (roles == null || roles.isEmpty()) roles = new HashSet<>();
    }
}
