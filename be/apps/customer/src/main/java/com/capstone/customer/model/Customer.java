package com.capstone.customer.model;

import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import com.capstone.customer.utils.Message;

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
  String customerId;

  @Column(nullable = false)
  String name;

  @Column(nullable = false)
  String email;

  @Column(nullable = false)
  String phoneNumber;

  @Column(nullable = false)
  String type;

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

  public void setType(String type) {
    requireText(type, Message.ENT_03);
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

  // <editor-fold> desc="builder"
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

    public CustomerBuilder waterMeterId(String value) {
      customer.setWaterMeterId(value);
      return this;
    }

    public CustomerBuilder waterPriceId(String value) {
      customer.setWaterPriceId(value);
      return this;
    }

    public CustomerBuilder formNumber(String value) {
      customer.setFormNumber(value);
      return this;
    }

    public CustomerBuilder formCode(String value) {
      customer.setFormCode(value);
      return this;
    }

    public Customer build() {
      Objects.requireNonNull(customer.name, SharedMessage.MES_05);
      if (customer.name.trim().isEmpty()) {
        throw new IllegalArgumentException(SharedMessage.MES_05);
      }
      return customer;
    }
  }
  // </editor-fold>
}
