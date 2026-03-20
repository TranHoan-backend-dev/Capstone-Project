package com.capstone.construction.domain.model;

import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

import com.capstone.construction.infrastructure.utils.Message;
import org.jspecify.annotations.NonNull;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConstructionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(nullable = false)
  String contractId;

  @OneToOne
  InstallationForm installationForm;

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
