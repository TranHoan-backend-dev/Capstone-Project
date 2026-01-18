package com.capstone.customer.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import com.capstone.customer.config.Constant;

import java.util.Objects;
import java.util.function.Consumer;

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

  @Setter
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
  @Setter
  Boolean isFree;
  @Setter
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

  @Setter
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

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.ENT_01);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_01);
    }
    this.name = name;
  }

  public void setEmail(String email) {
    Objects.requireNonNull(email, Constant.ENT_13);
    if (email.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_13);
    }
    if (!email.matches(Constant.EMAIL_PATTERN)) {
      throw new IllegalArgumentException(Constant.ENT_14);
    }
    this.email = email;
  }

  public void setPhoneNumber(String phoneNumber) {
    Objects.requireNonNull(phoneNumber, Constant.ENT_05);
    if (phoneNumber.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_05);
    }
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.ENT_15);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setType(String type) {
    requireText(type, Constant.ENT_07);
    this.type = type;
  }

  public void setUsageTarget(String usageTarget) {
    requireText(usageTarget, Constant.ENT_16);
    this.usageTarget = usageTarget;
  }

  public void setWaterMeterType(String waterMeterType) {
    requireText(waterMeterType, Constant.ENT_17);
    this.waterMeterType = waterMeterType;
  }

  public void setCitizenIdentificationNumber(String value) {
    requireText(value, Constant.ENT_18);
    this.citizenIdentificationNumber = value;
  }

  public void setCitizenIdentificationProvideAt(String value) {
    requireText(value, Constant.ENT_19);
    this.citizenIdentificationProvideAt = value;
  }

  public void setPaymentMethod(String paymentMethod) {
    requireText(paymentMethod, Constant.ENT_20);
    this.paymentMethod = paymentMethod;
  }

  public void setBankAccountNumber(String value) {
    requireText(value, Constant.ENT_21);
    this.bankAccountNumber = value;
  }

  public void setBankAccountProviderLocation(String value) {
    requireText(value, Constant.ENT_22);
    this.bankAccountProviderLocation = value;
  }

  public void setBankAccountName(String value) {
    requireText(value, Constant.ENT_23);
    this.bankAccountName = value;
  }

  public void setBudgetRelationshipCode(String budgetRelationshipCode) {
    requireText(budgetRelationshipCode, Constant.ENT_24);
    this.budgetRelationshipCode = budgetRelationshipCode;
  }

  public void setPassportCode(String passportCode) {
    requireText(passportCode, Constant.ENT_25);
    this.passportCode = passportCode;
  }

  public void setConnectionPoint(String connectionPoint) {
    requireText(connectionPoint, Constant.ENT_26);
    this.connectionPoint = connectionPoint;
  }

  public void setCancelReason(String cancelReason) {
    requireText(cancelReason, Constant.ENT_27);
    this.cancelReason = cancelReason;
  }

  public void setNumberOfHouseholds(Integer value) {
    Objects.requireNonNull(value, Constant.ENT_28);
    if (value <= 0) throw new IllegalArgumentException(Constant.ENT_28);
    this.numberOfHouseholds = value;
  }

  public void setHouseholdRegistrationNumber(Integer value) {
    requireNonNegative(value, Constant.ENT_29);
    this.householdRegistrationNumber = value;
  }

  public void setProtectEnvironmentFee(Integer value) {
    requireNonNegative(value, Constant.ENT_30);
    this.protectEnvironmentFee = value;
  }

  public void setInstallationFee(Integer value) {
    requireNonNegative(value, Constant.ENT_31);
    this.installationFee = value;
  }

  public void setMonthlyRent(Integer value) {
    requireNonNegative(value, Constant.ENT_32);
    this.monthlyRent = value;
  }

  public void setCommuneId(String value) {
    requireId(value, Constant.ENT_33);
    this.communeId = value;
  }

  public void setHamletId(String value) {
    requireId(value, Constant.ENT_34);
    this.hamletId = value;
  }

  public void setRoadmapId(String value) {
    requireId(value, Constant.ENT_35);
    this.roadmapId = value;
  }

  public void setRoadId(String value) {
    requireId(value, Constant.ENT_36);
    this.roadId = value;
  }

  public void setWaterProceId(String value) {
    requireId(value, Constant.ENT_37);
    this.waterProceId = value;
  }

  public void setBranchId(String value) {
    requireId(value, Constant.ENT_38);
    this.branchId = value;
  }

  public void setM3Sale(String value) {
    requireText(value, Constant.ENT_39);
    this.m3Sale = value;
  }

  public void setFixRate(String value) {
    requireText(value, Constant.ENT_40);
    this.fixRate = value;
  }

  public void setDeductionPeriod(String value) {
    requireText(value, Constant.ENT_41);
    this.deductionPeriod = value;
  }

  private void requireText(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  private void requireId(String value, String message) {
    Objects.requireNonNull(value, message);
  }

  private void requireNonNegative(Integer value, String message) {
    Objects.requireNonNull(value, message);
    if (value < 0) throw new IllegalArgumentException(message);
  }

  public static Customer create(@NonNull Consumer<CustomerBuilder> consumer) {
    var builder = new CustomerBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class CustomerBuilder {
    private final Customer customer = new Customer();

    public CustomerBuilder name(String name) {
      customer.setName(name);
      return this;
    }

    public CustomerBuilder email(String email) {
      customer.setEmail(email);
      return this;
    }

    public CustomerBuilder phoneNumber(String phoneNumber) {
      customer.setPhoneNumber(phoneNumber);
      return this;
    }

    public CustomerBuilder type(String type) {
      customer.setType(type);
      return this;
    }

    public CustomerBuilder isBigCustomer(Boolean isBigCustomer) {
      customer.setIsBigCustomer(isBigCustomer);
      return this;
    }

    public CustomerBuilder usageTarget(String usageTarget) {
      customer.setUsageTarget(usageTarget);
      return this;
    }

    public CustomerBuilder numberOfHouseholds(Integer numberOfHouseholds) {
      customer.setNumberOfHouseholds(numberOfHouseholds);
      return this;
    }

    public CustomerBuilder householdRegistrationNumber(Integer householdRegistrationNumber) {
      customer.setHouseholdRegistrationNumber(householdRegistrationNumber);
      return this;
    }

    public CustomerBuilder protectEnvironmentFee(Integer protectEnvironmentFee) {
      customer.setProtectEnvironmentFee(protectEnvironmentFee);
      return this;
    }

    public CustomerBuilder isFree(Boolean isFree) {
      customer.setIsFree(isFree);
      return this;
    }

    public CustomerBuilder isSale(Boolean isSale) {
      customer.setIsSale(isSale);
      return this;
    }

    public CustomerBuilder m3Sale(String m3Sale) {
      customer.setM3Sale(m3Sale);
      return this;
    }

    public CustomerBuilder fixRate(String fixRate) {
      customer.setFixRate(fixRate);
      return this;
    }

    public CustomerBuilder installationFee(Integer installationFee) {
      customer.setInstallationFee(installationFee);
      return this;
    }

    public CustomerBuilder deductionPeriod(String deductionPeriod) {
      customer.setDeductionPeriod(deductionPeriod);
      return this;
    }

    public CustomerBuilder monthlyRent(Integer monthlyRent) {
      customer.setMonthlyRent(monthlyRent);
      return this;
    }

    public CustomerBuilder waterMeterType(String waterMeterType) {
      customer.setWaterMeterType(waterMeterType);
      return this;
    }

    public CustomerBuilder citizenIdentificationNumber(String citizenIdentificationNumber) {
      customer.setCitizenIdentificationNumber(citizenIdentificationNumber);
      return this;
    }

    public CustomerBuilder citizenIdentificationProvideAt(String citizenIdentificationProvideAt) {
      customer.setCitizenIdentificationProvideAt(citizenIdentificationProvideAt);
      return this;
    }

    public CustomerBuilder paymentMethod(String paymentMethod) {
      customer.setPaymentMethod(paymentMethod);
      return this;
    }

    public CustomerBuilder bankAccountNumber(String bankAccountNumber) {
      customer.setBankAccountNumber(bankAccountNumber);
      return this;
    }

    public CustomerBuilder bankAccountProviderLocation(String bankAccountProviderLocation) {
      customer.setBankAccountProviderLocation(bankAccountProviderLocation);
      return this;
    }

    public CustomerBuilder bankAccountName(String bankAccountName) {
      customer.setBankAccountName(bankAccountName);
      return this;
    }

    public CustomerBuilder budgetRelationshipCode(String budgetRelationshipCode) {
      customer.setBudgetRelationshipCode(budgetRelationshipCode);
      return this;
    }

    public CustomerBuilder passportCode(String passportCode) {
      customer.setPassportCode(passportCode);
      return this;
    }

    public CustomerBuilder connectionPoint(String connectionPoint) {
      customer.setConnectionPoint(connectionPoint);
      return this;
    }

    public CustomerBuilder isActive(Boolean isActive) {
      customer.setIsActive(isActive);
      return this;
    }

    public CustomerBuilder cancelReason(String cancelReason) {
      customer.setCancelReason(cancelReason);
      return this;
    }

    public CustomerBuilder communeId(String communeId) {
      customer.setCommuneId(communeId);
      return this;
    }

    public CustomerBuilder hamletId(String hamletId) {
      customer.setHamletId(hamletId);
      return this;
    }

    public CustomerBuilder roadmapId(String roadmapId) {
      customer.setRoadmapId(roadmapId);
      return this;
    }

    public CustomerBuilder roadId(String roadId) {
      customer.setRoadId(roadId);
      return this;
    }

    public CustomerBuilder waterProceId(String waterProceId) {
      customer.setWaterProceId(waterProceId);
      return this;
    }

    public CustomerBuilder branchId(String branchId) {
      customer.setBranchId(branchId);
      return this;
    }

    public Customer build() {
      Objects.requireNonNull(customer.name, Constant.ENT_01);
      if (customer.name.trim().isEmpty()) {
        throw new IllegalArgumentException(Constant.ENT_01);
      }
      return customer;
    }
  }
}
