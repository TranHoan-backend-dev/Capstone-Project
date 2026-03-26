package com.capstone.customer.model;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import com.capstone.customer.utils.Message;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

import java.time.LocalDateTime;

@Builder
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
  String customerId;

  @Column(nullable = false)
  String name;

  @Column(nullable = false)
  String email;

  @Column(nullable = false)
  @Setter
  String address;

  @Column(nullable = false)
  String phoneNumber;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  CustomerType type; // loai khach hang

  @Setter
  @Column(nullable = false)
  Boolean isBigCustomer;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  UsageTarget usageTarget;

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

  @Column(nullable = false)
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

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false)
  String formNumber;

  @Column(nullable = false, unique = true)
  String formCode;

  @Column(nullable = false)
  String waterPriceId;

  @Column(nullable = false)
  String waterMeterId;

  @Setter
  @Column(nullable = false)
  String roadmapId;

  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @ToString.Exclude
  List<Bill> bills;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
    this.bills = new ArrayList<>();
  }

  public void addNewBill(Bill bill) {
    bill.setCustomer(this);
    this.bills.addFirst(bill);
  }

  public Bill getTheClosestBill() {
    if (bills == null || bills.isEmpty()) {
      return null;
    }
    return bills.getFirst();
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public void setName(String name) {
    Objects.requireNonNull(name, SharedMessage.MES_05);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(SharedMessage.MES_05);
    }
    this.name = name;
  }

  // <editor-fold> desc="setter"
  public void setEmail(String email) {
    Objects.requireNonNull(email, SharedMessage.MES_02);
    if (email.trim().isEmpty()) {
      throw new IllegalArgumentException(SharedMessage.MES_02);
    }
    if (!email.matches(SharedConstant.EMAIL_PATTERN)) {
      throw new IllegalArgumentException(SharedMessage.MES_01);
    }
    this.email = email;
  }

  public void setPhoneNumber(String phoneNumber) {
    Objects.requireNonNull(phoneNumber, SharedMessage.MES_03);
    if (phoneNumber.trim().isEmpty()) {
      throw new IllegalArgumentException(SharedMessage.MES_03);
    }
    if (!phoneNumber.matches(SharedConstant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(SharedMessage.MES_04);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setType(CustomerType type) {
    Objects.requireNonNull(type, Message.ENT_03);
    this.type = type;
  }

  public void setUsageTarget(String usageTarget) {
    requireText(usageTarget, Message.ENT_06);
    this.usageTarget = UsageTarget.valueOf(usageTarget.trim().toUpperCase());
  }

  public void setWaterMeterType(String waterMeterType) {
    requireText(waterMeterType, Message.ENT_07);
    this.waterMeterType = waterMeterType;
  }

  public void setCitizenIdentificationNumber(String value) {
    requireText(value, SharedMessage.MES_10);
    this.citizenIdentificationNumber = value;
  }

  public void setCitizenIdentificationProvideAt(String value) {
    requireText(value, SharedMessage.MES_16);
    this.citizenIdentificationProvideAt = value;
  }

  public void setPaymentMethod(String paymentMethod) {
    requireText(paymentMethod, Message.ENT_08);
    this.paymentMethod = paymentMethod;
  }

  public void setBankAccountNumber(String value) {
    requireText(value, SharedMessage.MES_13);
    this.bankAccountNumber = value;
  }

  public void setBankAccountProviderLocation(String value) {
    requireText(value, SharedMessage.MES_17);
    this.bankAccountProviderLocation = value;
  }

  public void setBankAccountName(String value) {
    requireText(value, Message.ENT_09);
    this.bankAccountName = value;
  }

  public void setBudgetRelationshipCode(String budgetRelationshipCode) {
    requireText(budgetRelationshipCode, Message.ENT_10);
    this.budgetRelationshipCode = budgetRelationshipCode;
  }

  public void setPassportCode(String passportCode) {
    requireText(passportCode, Message.ENT_11);
    this.passportCode = passportCode;
  }

  public void setConnectionPoint(String connectionPoint) {
    requireText(connectionPoint, Message.ENT_12);
    this.connectionPoint = connectionPoint;
  }

  public void setCancelReason(String cancelReason) {
    requireText(cancelReason, Message.ENT_13);
    this.cancelReason = cancelReason;
  }

  public void setNumberOfHouseholds(Integer value) {
    Objects.requireNonNull(value, SharedMessage.MES_11);
    if (value <= 0)
      throw new IllegalArgumentException(SharedMessage.MES_11);
    this.numberOfHouseholds = value;
  }

  public void setHouseholdRegistrationNumber(Integer value) {
    requireNonNegative(value, SharedMessage.MES_12);
    this.householdRegistrationNumber = value;
  }

  public void setProtectEnvironmentFee(Integer value) {
    requireNonNegative(value, Message.ENT_14);
    this.protectEnvironmentFee = value;
  }

  public void setInstallationFee(Integer value) {
    requireNonNegative(value, SharedMessage.MES_15);
    this.installationFee = value;
  }

  public void setMonthlyRent(Integer value) {
    requireNonNegative(value, Message.ENT_15);
    this.monthlyRent = value;
  }

  public void setFormNumber(String value) {
    requireId(value, SharedMessage.MES_20);
    this.formNumber = value;
  }

  public void setFormCode(String value) {
    requireId(value, SharedMessage.MES_21);
    this.formCode = value;
  }

  public void setWaterPriceId(String value) {
    requireId(value, Message.ENT_17);
    this.waterPriceId = value;
  }

  public void setWaterMeterId(String value) {
    requireId(value, Message.ENT_18);
    this.waterMeterId = value;
  }

  public void setM3Sale(String value) {
    requireText(value, Message.ENT_19);
    this.m3Sale = value;
  }

  public void setFixRate(String value) {
    requireText(value, Message.ENT_20);
    this.fixRate = value;
  }

  public void setDeductionPeriod(String value) {
    requireText(value, Message.ENT_21);
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
    if (value < 0)
      throw new IllegalArgumentException(message);
  }
  // </editor-fold>
}
