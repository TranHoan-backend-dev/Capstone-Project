package com.capstone.auth.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "verification_codes")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerificationCode {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "otp_code", nullable = false)
    String otpCode;

    @Column(name = "expired_at", nullable = false)
    LocalDateTime expiredAt;

    @Column(name = "attempt_count", nullable = false)
    int attemptCount;

    @Column(name = "last_generated_time")
    LocalDateTime lastGeneratedTime;

    @Column(name = "blocked_until")
    LocalDateTime blockedUntil;
}
