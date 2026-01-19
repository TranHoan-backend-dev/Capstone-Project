package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Table
@Getter
@Entity
@Builder
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

  /* ================== */
  /* RELATION KEYS ONLY */
  /* ================== */

  @Column(nullable = false)
  String customerId;

  String roadId;

  String communeId;

  String neighborhoodUnitId;

  @Column(nullable = false)
  String branchId;

  String hamletId;

  String overalWaterMeterCode;
}
