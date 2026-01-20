package com.capstone.organization.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;

@Table
@Getter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Job {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "job_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  String employeeId;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }
  // TODO: setter
}
