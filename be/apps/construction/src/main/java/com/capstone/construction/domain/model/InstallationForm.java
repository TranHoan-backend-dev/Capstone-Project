package com.capstone.construction.domain.model;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.Representative;
import com.capstone.common.enumerate.UsageTarget;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

import com.capstone.construction.infrastructure.utils.Message;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.jspecify.annotations.NonNull;

@Table
@Getter
@Entity
@ToString(exclude = "network")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationForm {
  @EmbeddedId
  InstallationFormId id = new InstallationFormId();

  // <editor-fold> desc="thông tin chung của đơn"
  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String address;

  @Column(length = 12, nullable = false)
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

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  UsageTarget usageTarget;

  @Column(nullable = false)
  LocalDate receivedFormAt;

  LocalDate scheduleSurveyAt;

  @Column(nullable = false)
  Integer numberOfHousehold;

  @Column(nullable = false)
  Integer householdRegistrationNumber; // ho khau

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  List<Representative> representative;

  @Column(nullable = false, columnDefinition = "jsonb")
  @JdbcTypeCode(SqlTypes.JSON)
  FormProcessingStatus status;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  CustomerType customerType;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  @Column(nullable = false)
  String overallWaterMeterId;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;
  // </editor-fold>

  @Column(nullable = false)
  String createdBy; // the planning-technical department staff who create this form
  String handoverBy; // the planning-technical department staff who will approve/reject this form
  String constructedBy; // nhân viên thi công đảm nhiệm công việc

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
    this.status = new FormProcessingStatus(
      ProcessingStatus.PENDING_FOR_APPROVAL,
      ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING);
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public String getFormNumber() {
    return id.getFormNumber();
  }

  public String getFormCode() {
    return id.getFormCode();
  }

  public void setFormNumber(String formNumber) {
    requireNonNullAndNotEmpty(formNumber, SharedMessage.MES_20);
    this.id.setFormNumber(formNumber);
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Message.PT_14);
    this.customerName = customerName;
  }

  public void setConstructedBy(String value) {
    requireNonNullAndNotEmpty(value, Message.PT_02);
    this.constructedBy = value;
  }

  public void setStatus(FormProcessingStatus status) {
    Objects.requireNonNull(status, Message.PT_14);
    this.status = status;
  }

  public void setRepresentative(List<Representative> representative) {
    Objects.requireNonNull(representative, SharedMessage.MES_22);
    this.representative = representative;
  }

  public void setCitizenIdentificationNumber(String citizenIdentificationNumber) {
    requireNonNullAndNotEmpty(citizenIdentificationNumber, SharedMessage.MES_10);
    this.citizenIdentificationNumber = citizenIdentificationNumber;
  }

  public void setCitizenIdentificationProvideDate(String citizenIdentificationProvideDate) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideDate,
      Message.PT_30);
    this.citizenIdentificationProvideDate = citizenIdentificationProvideDate;
  }

  public void setCitizenIdentificationProvideLocation(String citizenIdentificationProvideLocation) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideLocation,
      SharedMessage.MES_16);
    this.citizenIdentificationProvideLocation = citizenIdentificationProvideLocation;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, SharedMessage.MES_03);
    if (!phoneNumber.matches(SharedConstant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(SharedMessage.MES_04);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setTaxCode(String taxCode) {
    requireNonNullAndNotEmpty(taxCode, Message.PT_31);
    this.taxCode = taxCode;
  }

  public void setBankAccountNumber(String bankAccountNumber) {
    requireNonNullAndNotEmpty(bankAccountNumber, SharedMessage.MES_13);
    this.bankAccountNumber = bankAccountNumber;
  }

  public void setBankAccountProviderLocation(String bankAccountProviderLocation) {
    requireNonNullAndNotEmpty(bankAccountProviderLocation, SharedMessage.MES_17);
    this.bankAccountProviderLocation = bankAccountProviderLocation;
  }

  public void setUsageTarget(UsageTarget usageTarget) {
    Objects.requireNonNull(usageTarget, Message.PT_32);
    this.usageTarget = usageTarget;
  }

  public void setReceivedFormAt(LocalDate receivedFormAt) {
    Objects.requireNonNull(receivedFormAt, Message.PT_33);
    this.receivedFormAt = receivedFormAt;
  }

  public void setScheduleSurveyAt(LocalDate scheduleSurveyAt) {
    Objects.requireNonNull(scheduleSurveyAt, Message.PT_51);
    this.scheduleSurveyAt = scheduleSurveyAt;
  }

  public void setNumberOfHousehold(Integer numberOfHousehold) {
    Objects.requireNonNull(numberOfHousehold, SharedMessage.MES_11);
    this.numberOfHousehold = numberOfHousehold;
  }

  public void setHouseholdRegistrationNumber(Integer householdRegistrationNumber) {
    Objects.requireNonNull(householdRegistrationNumber, SharedMessage.MES_12);
    this.householdRegistrationNumber = householdRegistrationNumber;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Message.PT_34);
    this.network = network;
  }

  public void setCreatedBy(String value) {
    requireNonNullAndNotEmpty(value, Message.PT_36);
    this.createdBy = value;
  }

  public void setHandoverBy(String value) {
    requireNonNullAndNotEmpty(value, Message.PT_52);
    this.handoverBy = value;
  }

  public void setOverallWaterMeterId(String overallWaterMeterId) {
    requireNonNullAndNotEmpty(overallWaterMeterId, Message.PT_37);
    this.overallWaterMeterId = overallWaterMeterId;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, SharedMessage.MES_06);
    this.address = address;
  }

  public void setCustomerType(CustomerType value) {
    Objects.requireNonNull(value, Message.PT_06);
    this.customerType = value;
  }

  public void setFormCode(String value) {
    requireNonNullAndNotEmpty(value, SharedMessage.MES_21);
    this.id.setFormCode(value);
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

    public InstallationFormBuilder formCode(String value) {
      instance.setFormCode(value);
      return this;
    }

    public InstallationFormBuilder customerType(CustomerType value) {
      instance.setCustomerType(value);
      return this;
    }

    public InstallationFormBuilder customerName(String customerName) {
      instance.setCustomerName(customerName);
      return this;
    }

    public InstallationFormBuilder constructedBy(String value) {
      instance.setConstructedBy(value);
      return this;
    }

    public InstallationFormBuilder representative(List<Representative> representative) {
      instance.setRepresentative(representative);
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

    public InstallationFormBuilder usageTarget(UsageTarget usageTarget) {
      instance.setUsageTarget(usageTarget);
      return this;
    }

    public InstallationFormBuilder receivedFormAt(LocalDate receivedFormAt) {
      instance.setReceivedFormAt(receivedFormAt);
      return this;
    }

    public InstallationFormBuilder scheduleSurveyAt(LocalDate scheduleSurveyAt) {
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
