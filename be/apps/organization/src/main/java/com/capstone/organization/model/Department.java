package com.capstone.organization.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;

@Table
@Getter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "department_id")
  String id;

  @Column(nullable = false)
  String name;

  @Column(nullable = false, unique = true)
  String phoneNumber;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }
  // TODO: setter
}
