package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

import com.capstone.construction.infrastructure.config.Constant;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PendingConstructionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "installation_form_code")
  String id;

  @Column(nullable = false)
  String contractId;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String phoneNumber;

  @Column(nullable = false)
  String address;

  @Column(nullable = false)
  LocalDate registrationDate;

  @Column(nullable = false)
  String employeeInChargeId;

  public void setContractId(String contractId) {
    requireNonNullAndNotEmpty(contractId, Constant.PT_63);
    this.contractId = contractId;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Constant.PT_27);
    this.customerName = customerName;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, Constant.PT_15);
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_14);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  public void setRegistrationDate(LocalDate registrationDate) {
    Objects.requireNonNull(registrationDate, Constant.PT_64);
    this.registrationDate = registrationDate;
  }

  public void setEmployeeInChargeId(String employeeInChargeId) {
    requireNonNullAndNotEmpty(employeeInChargeId, Constant.PT_65);
    this.employeeInChargeId = employeeInChargeId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static PendingConstructionRequest create(Consumer<PendingConstructionRequestBuilder> builder) {
    var instance = new PendingConstructionRequestBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class PendingConstructionRequestBuilder {
    private String contractId;
    private String customerName;
    private String phoneNumber;
    private String address;
    private LocalDate registrationDate;
    private String employeeInChargeId;

    public PendingConstructionRequestBuilder contractId(String contractId) {
      this.contractId = contractId;
      return this;
    }

    public PendingConstructionRequestBuilder customerName(String customerName) {
      this.customerName = customerName;
      return this;
    }

    public PendingConstructionRequestBuilder phoneNumber(String phoneNumber) {
      this.phoneNumber = phoneNumber;
      return this;
    }

    public PendingConstructionRequestBuilder address(String address) {
      this.address = address;
      return this;
    }

    public PendingConstructionRequestBuilder registrationDate(LocalDate registrationDate) {
      this.registrationDate = registrationDate;
      return this;
    }

    public PendingConstructionRequestBuilder employeeInChargeId(String employeeInChargeId) {
      this.employeeInChargeId = employeeInChargeId;
      return this;
    }

    public PendingConstructionRequest build() {
      var request = new PendingConstructionRequest();
      request.setContractId(contractId);
      request.setCustomerName(customerName);
      request.setPhoneNumber(phoneNumber);
      request.setAddress(address);
      request.setRegistrationDate(registrationDate);
      request.setEmployeeInChargeId(employeeInChargeId);
      return request;
    }
  }

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
}
