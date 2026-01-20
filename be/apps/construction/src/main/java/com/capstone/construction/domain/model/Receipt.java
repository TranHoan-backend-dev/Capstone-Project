package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Receipt {
  @Id
  String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId
  InstallationForm installationForm;

  @Column(nullable = false)
  String receiptNumber;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String address;

  @Column(nullable = false)
  LocalDate paymentDate;

  @Column(nullable = false)
  Boolean isPaid;

  public void setInstallationForm(InstallationForm installationForm) {
    Objects.requireNonNull(installationForm, Constant.PT_66);
    this.installationForm = installationForm;
    this.id = installationForm.getFormCode();
  }

  public void setReceiptNumber(String receiptNumber) {
    requireNonNullAndNotEmpty(receiptNumber, Constant.PT_67);
    this.receiptNumber = receiptNumber;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Constant.PT_27);
    this.customerName = customerName;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  public void setPaymentDate(LocalDate paymentDate) {
    Objects.requireNonNull(paymentDate, Constant.PT_68);
    this.paymentDate = paymentDate;
  }

  public void setIsPaid(Boolean isPaid) {
    Objects.requireNonNull(isPaid, Constant.PT_69);
    this.isPaid = isPaid;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Receipt create(Consumer<ReceiptBuilder> builder) {
    var instance = new ReceiptBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class ReceiptBuilder {
    private InstallationForm installationForm;
    private String receiptNumber;
    private String customerName;
    private String address;
    private LocalDate paymentDate;
    private Boolean isPaid;

    public ReceiptBuilder installationForm(InstallationForm installationForm) {
      this.installationForm = installationForm;
      return this;
    }

    public ReceiptBuilder receiptNumber(String receiptNumber) {
      this.receiptNumber = receiptNumber;
      return this;
    }

    public ReceiptBuilder customerName(String customerName) {
      this.customerName = customerName;
      return this;
    }

    public ReceiptBuilder address(String address) {
      this.address = address;
      return this;
    }

    public ReceiptBuilder paymentDate(LocalDate paymentDate) {
      this.paymentDate = paymentDate;
      return this;
    }

    public ReceiptBuilder isPaid(Boolean isPaid) {
      this.isPaid = isPaid;
      return this;
    }

    public Receipt build() {
      var receipt = new Receipt();
      if (installationForm != null) {
        receipt.setInstallationForm(installationForm);
      }
      receipt.setReceiptNumber(receiptNumber);
      receipt.setCustomerName(customerName);
      receipt.setAddress(address);
      receipt.setPaymentDate(paymentDate);
      receipt.setIsPaid(isPaid);
      return receipt;
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
