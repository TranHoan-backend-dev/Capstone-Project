package com.capstone.construction.domain.model;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.ProcessingStatus;
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

import com.capstone.construction.infrastructure.utils.Message;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Builder
@Table
@Getter
@Entity
@ToString(exclude = "network")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationForm {
  @EmbeddedId
  @Builder.Default
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
  @JoinColumn(name = "water_supply_network_id", nullable = false)
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
    Objects.requireNonNull(formNumber, SharedMessage.MES_20);
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

  public void setTaxCode(String taxCode) {
    requireNonNullAndNotEmpty(taxCode, Message.PT_31);
    this.taxCode = taxCode;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Message.PT_34);
    this.network = network;
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

  public void setFormCode(String value) {
    Objects.requireNonNull(value, SharedMessage.MES_21);
    this.id.setFormCode(value);
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }
}
