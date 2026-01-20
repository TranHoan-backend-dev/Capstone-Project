package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationForm {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String formCode;

  @Column(length = 36, unique = true)
  String formNumber;

  @Column(nullable = false)
  String customerName;

  String representative;

  String businessPosition;

  @Column(nullable = false)
  String houseNumber;

  @Column(length = 12, unique = true, nullable = false)
  String citizenIdentificationNumber;

  @Column(nullable = false)
  String citizenIdentificationProvideDate;

  @Column(nullable = false)
  String citizenIdentificationProvideLocation;

  @Column(length = 10, unique = true, nullable = false)
  String phoneNumber;

  String taxCode;

  @Column(nullable = false)
  String bankAccountNumber;

  @Column(nullable = false)
  String bankAccountProviderLocation;

  @Column(nullable = false)
  String usageTarget;

  @Column(nullable = false)
  LocalDateTime receivedFormAt;

  LocalDateTime scheduleSurveyAt;

  @Column(nullable = false)
  Integer numberOfHousehold;

  @Column(nullable = false)
  Integer householdRegistrationNumber;

//  String object;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "road_id")
  Road road;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "unit_id")
  NeighborhoodUnit unit;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "hamlet_id")
  Hamlet hamlet;
  String surveyEmployeeId;

  @Column(nullable = false)
  String overallWaterMeterId;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

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
