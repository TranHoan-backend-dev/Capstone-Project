package com.capstone.construction.domain.model;

import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.significance.ReceiptSignificance;
import jakarta.persistence.*;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Builder
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Receipt {
  @EmbeddedId
  InstallationFormId installationFormId;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @MapsId
  InstallationForm installationForm;

  @Column(nullable = false)
  String receiptNumber;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String totalMoneyInDigits;

  String totalMoneyInCharacters;

  @Column(nullable = false)
  String paymentReason;

  @Setter
  String attach;

  @Setter
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  ReceiptSignificance significance;

  @Column(nullable = false)
  String address;

  @Column(nullable = false)
  LocalDate paymentDate;

  @Column(nullable = false)
  Boolean isPaid;

  public void setInstallationForm(InstallationForm installationForm) {
    Objects.requireNonNull(installationForm, Message.PT_41);
    this.installationForm = installationForm;
    this.installationFormId = installationForm.getId();
  }

  public void setReceiptNumber(String receiptNumber) {
    requireNonNullAndNotEmpty(receiptNumber, Message.PT_42);
    this.receiptNumber = receiptNumber;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Message.PT_14);
    this.customerName = customerName;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, SharedMessage.MES_06);
    this.address = address;
  }

  public void setPaymentDate(LocalDate paymentDate) {
    Objects.requireNonNull(paymentDate, Message.PT_43);
    this.paymentDate = paymentDate;
  }

  public void setIsPaid(Boolean isPaid) {
    Objects.requireNonNull(isPaid, Message.PT_44);
    this.isPaid = isPaid;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
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
