package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Estimation implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "est_id")
  String estimationId;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String address;

  String note;

  @Column(nullable = false)
  Integer contractFee;

  @Column(nullable = false)
  Integer surveyFee;

  @Column(nullable = false)
  Integer surveyEffort;

  @Column(nullable = false)
  Integer installationFee;

  @Column(nullable = false)
  Integer laborCoefficient;

  @Column(nullable = false)
  Integer generalCostCoefficient;

  @Column(nullable = false)
  Integer precalculatedTaxCoefficient;

  @Column(nullable = false)
  Integer constructionMachineryCoefficient;

  @Column(nullable = false)
  Integer varCoefficient;

  @Column(nullable = false)
  Integer designCoefficient;

  @Column(nullable = false)
  Integer designFee;

  @Column(nullable = false)
  String waterMeterType;

  @Column(nullable = false)
  String waterMeterCode;
  //object, obj

  @Column(nullable = false)
  String designImageUrl;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false)
  String createBy; // reference to Users, describe which employee has been processing

  @Column(nullable = false)
  String waterMeterId;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

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
