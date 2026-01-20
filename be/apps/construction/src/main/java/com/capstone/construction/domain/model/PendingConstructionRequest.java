package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PendingConstructionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "installation_form_code")
  String id;

  @Column(nullable = false)
  String contractId;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String phoneNumber;

  @Column(nullable = false)
  String address;

  @Column(nullable = false)
  LocalDate registrationDate;

  @Column(nullable = false)
  String employeeInChargeId;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
