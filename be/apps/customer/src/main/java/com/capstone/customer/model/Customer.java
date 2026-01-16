package com.capstone.customer.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Table
@Getter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(nullable = false)
  String name;

  @Column(nullable = false)
  String email;

  @Column(nullable = false)
  String phoneNumber;
  // object

  @Column(nullable = false)
  String type;

  @Column(nullable = false)
  Boolean isBigCustomer;

  @Column(nullable = false)
  String usageTarget;

  @Column(nullable = false)
  Integer numberOfHouseholds;

  @Column(nullable = false)
  Integer householdRegistrationNumber;

  @Column(nullable = false)
  Integer protectEnvironmentFee;
  Boolean isFree;
  Boolean isSale;
  String m3Sale;
  String fixRate;
  Integer installationFee;
  String deductionPeriod;
  Integer monthlyRent;

  @Column(nullable = false)
  String waterMeterType;

  @Column(nullable = false, unique = true)
  String citizenIdentificationNumber;

  @Column(nullable = false)
  String citizenIdentificationProvideAt;

  @Column(nullable = false)
  String paymentMethod;

  @Column(nullable = false)
  String bankAccountNumber;

  @Column(nullable = false)
  String bankAccountProviderLocation;

  @Column(nullable = false)
  String bankAccountName;
  String budgetRelationshipCode;
  String passportCode;
  String connectionPoint;

  @Column(nullable = false)
  Boolean isActive;
  String cancelReason;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  @Column(nullable = false)
  String communeId;

  @Column(nullable = false)
  String hamletId;

  @Column(nullable = false)
  String roadmapId;

  @Column(nullable = false)
  String roadId;

  @Column(nullable = false)
  String waterProceId;

  @Column(nullable = false)
  String branchId;

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
