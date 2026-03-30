package com.capstone.auth.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_devices")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Device {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(nullable = false)
  String userId;

  @Column(nullable = false)
  String deviceId; // This should be a unique identifier from the client side

  @Column
  String deviceInfo; // User-Agent or Model name

  @Column
  String ipAddress;

  @Column(nullable = false)
  LocalDateTime lastLoginAt;

  @Column(nullable = false)
  Boolean isKnown;

  @PrePersist
  protected void onCreate() {
    lastLoginAt = LocalDateTime.now();
    if (isKnown == null) isKnown = true;
  }
}
