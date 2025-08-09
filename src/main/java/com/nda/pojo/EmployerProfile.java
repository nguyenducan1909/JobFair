package com.nda.pojo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="employer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerProfile {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="user_id", nullable=false, unique=true) private User user;
    @Column(nullable=false) private String companyName;
    @Column(nullable=false) private boolean verified = false;
}
