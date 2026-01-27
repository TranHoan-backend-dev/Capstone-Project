package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

import com.capstone.construction.infrastructure.config.Constant;
import org.jspecify.annotations.NonNull;

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

  @Column(nullable = false)
  String address;

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

  @Column(length = 10, nullable = false)
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

  // String object;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  @Column(nullable = false)
  String createdBy; // the planning-technical department staff who create this form
  String handoverBy; // the planning-technical department staff who will approve/reject this form

  @Column(nullable = false)
  String overallWaterMeterId;

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

  public void setFormNumber(String formNumber) {
    requireNonNullAndNotEmpty(formNumber, Constant.PT_44);
    this.formNumber = formNumber;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Constant.PT_27);
    this.customerName = customerName;
  }

  public void setRepresentative(String representative) {
    requireNonNullAndNotEmpty(representative, Constant.PT_45);
    this.representative = representative;
  }

  public void setBusinessPosition(String businessPosition) {
    requireNonNullAndNotEmpty(businessPosition, Constant.PT_46);
    this.businessPosition = businessPosition;
  }

  public void setHouseNumber(String houseNumber) {
    requireNonNullAndNotEmpty(houseNumber, Constant.PT_47);
    this.houseNumber = houseNumber;
  }

  public void setCitizenIdentificationNumber(String citizenIdentificationNumber) {
    requireNonNullAndNotEmpty(citizenIdentificationNumber, Constant.PT_48);
    this.citizenIdentificationNumber = citizenIdentificationNumber;
  }

  public void setCitizenIdentificationProvideDate(String citizenIdentificationProvideDate) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideDate,
        Constant.PT_49);
    this.citizenIdentificationProvideDate = citizenIdentificationProvideDate;
  }

  public void setCitizenIdentificationProvideLocation(String citizenIdentificationProvideLocation) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideLocation,
        Constant.PT_50);
    this.citizenIdentificationProvideLocation = citizenIdentificationProvideLocation;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, Constant.PT_15);
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_14);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setTaxCode(String taxCode) {
    requireNonNullAndNotEmpty(taxCode, Constant.PT_51);
    this.taxCode = taxCode;
  }

  public void setBankAccountNumber(String bankAccountNumber) {
    requireNonNullAndNotEmpty(bankAccountNumber, Constant.PT_52);
    this.bankAccountNumber = bankAccountNumber;
  }

  public void setBankAccountProviderLocation(String bankAccountProviderLocation) {
    requireNonNullAndNotEmpty(bankAccountProviderLocation, Constant.PT_53);
    this.bankAccountProviderLocation = bankAccountProviderLocation;
  }

  public void setUsageTarget(String usageTarget) {
    requireNonNullAndNotEmpty(usageTarget, Constant.PT_54);
    this.usageTarget = usageTarget;
  }

  public void setReceivedFormAt(LocalDateTime receivedFormAt) {
    Objects.requireNonNull(receivedFormAt, Constant.PT_55);
    this.receivedFormAt = receivedFormAt;
  }

  public void setScheduleSurveyAt(LocalDateTime scheduleSurveyAt) {
    Objects.requireNonNull(scheduleSurveyAt, Constant.PT_78);
    this.scheduleSurveyAt = scheduleSurveyAt;
  }

  public void setNumberOfHousehold(Integer numberOfHousehold) {
    Objects.requireNonNull(numberOfHousehold, Constant.PT_56);
    this.numberOfHousehold = numberOfHousehold;
  }

  public void setHouseholdRegistrationNumber(Integer householdRegistrationNumber) {
    Objects.requireNonNull(householdRegistrationNumber, Constant.PT_57);
    this.householdRegistrationNumber = householdRegistrationNumber;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Constant.PT_59);
    this.network = network;
  }

  public void setCreatedBy(String value) {
    requireNonNullAndNotEmpty(value, Constant.PT_61);
    this.createdBy = value;
  }

  public void setHandoverBy(String value) {
    requireNonNullAndNotEmpty(value, Constant.PT_79);
    this.handoverBy = value;
  }

  public void setOverallWaterMeterId(String overallWaterMeterId) {
    requireNonNullAndNotEmpty(overallWaterMeterId, Constant.PT_62);
    this.overallWaterMeterId = overallWaterMeterId;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static InstallationForm create(@NonNull Consumer<InstallationFormBuilder> builder) {
    var instance = new InstallationFormBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class InstallationFormBuilder {
    private final InstallationForm instance = new InstallationForm();

    public InstallationFormBuilder formNumber(String formNumber) {
      instance.setFormNumber(formNumber);
      return this;
    }

    public InstallationFormBuilder customerName(String customerName) {
      instance.setCustomerName(customerName);
      return this;
    }

    public InstallationFormBuilder representative(String representative) {
      instance.setRepresentative(representative);
      return this;
    }

    public InstallationFormBuilder businessPosition(String businessPosition) {
      instance.setBusinessPosition(businessPosition);
      return this;
    }

    public InstallationFormBuilder houseNumber(String houseNumber) {
      instance.setHouseNumber(houseNumber);
      return this;
    }

    public InstallationFormBuilder citizenIdentificationNumber(String citizenIdentificationNumber) {
      instance.setCitizenIdentificationNumber(citizenIdentificationNumber);
      return this;
    }

    public InstallationFormBuilder citizenIdentificationProvideDate(String citizenIdentificationProvideDate) {
      instance.setCitizenIdentificationProvideDate(citizenIdentificationProvideDate);
      return this;
    }

    public InstallationFormBuilder citizenIdentificationProvideLocation(String citizenIdentificationProvideLocation) {
      instance.setCitizenIdentificationProvideLocation(citizenIdentificationProvideLocation);
      return this;
    }

    public InstallationFormBuilder phoneNumber(String phoneNumber) {
      instance.setPhoneNumber(phoneNumber);
      return this;
    }

    public InstallationFormBuilder taxCode(String taxCode) {
      instance.setTaxCode(taxCode);
      return this;
    }

    public InstallationFormBuilder bankAccountNumber(String bankAccountNumber) {
      instance.setBankAccountNumber(bankAccountNumber);
      return this;
    }

    public InstallationFormBuilder bankAccountProviderLocation(String bankAccountProviderLocation) {
      instance.setBankAccountProviderLocation(bankAccountProviderLocation);
      return this;
    }

    public InstallationFormBuilder usageTarget(String usageTarget) {
      instance.setUsageTarget(usageTarget);
      return this;
    }

    public InstallationFormBuilder receivedFormAt(LocalDateTime receivedFormAt) {
      instance.setReceivedFormAt(receivedFormAt);
      return this;
    }

    public InstallationFormBuilder scheduleSurveyAt(LocalDateTime scheduleSurveyAt) {
      instance.setScheduleSurveyAt(scheduleSurveyAt);
      return this;
    }

    public InstallationFormBuilder numberOfHousehold(Integer numberOfHousehold) {
      instance.setNumberOfHousehold(numberOfHousehold);
      return this;
    }

    public InstallationFormBuilder householdRegistrationNumber(Integer householdRegistrationNumber) {
      instance.setHouseholdRegistrationNumber(householdRegistrationNumber);
      return this;
    }

    public InstallationFormBuilder network(WaterSupplyNetwork network) {
      instance.setNetwork(network);
      return this;
    }

    public InstallationFormBuilder createdBy(String createdBy) {
      instance.setCreatedBy(createdBy);
      return this;
    }

    public InstallationFormBuilder handoverBy(String handoverBy) {
      instance.setHandoverBy(handoverBy);
      return this;
    }

    public InstallationFormBuilder overallWaterMeterId(String overallWaterMeterId) {
      instance.setOverallWaterMeterId(overallWaterMeterId);
      return this;
    }

    public InstallationFormBuilder address(String address) {
      instance.setAddress(address);
      return this;
    }

    public InstallationForm build() {
      return instance;
    }
  }
}
