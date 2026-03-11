package com.capstone.device.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Parameters {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String paramId;

  // <editor-fold desc="setter">
  @Setter
  @Column(nullable = false, unique = true)
  String name;

  @Setter
  @Column(nullable = false)
  BigDecimal value;

  @Column(nullable = false)
  String creator;

  @Setter
  @Column(nullable = false)
  String updator;

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
