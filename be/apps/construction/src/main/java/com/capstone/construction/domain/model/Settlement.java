package com.capstone.construction.domain.model;

import com.capstone.construction.domain.model.utils.ProcessingStatus;
import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Settlement implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String settlementId;

  @Column(nullable = false)
  String jobContent;

  @Column(nullable = false)
  String address;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal connectionFee;

  @Column(nullable = false)
  String note;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  ProcessingStatus status;

  @Column(nullable = false)
  LocalDate registrationAt;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // <editor-fold> desc="setter"
  public void setStatus(@NonNull ProcessingStatus value) {
    requireNonNullAndNotEmpty(value.name(), Constant.PT_03);
    this.status = value;
  }

  public void setRegistrationAt(@NonNull LocalDate value) {
    Objects.requireNonNull(value, Constant.PT_04);
    this.registrationAt = value;
  }

  public void setJobContent(String jobContent) {
    requireNonNullAndNotEmpty(jobContent, Constant.PT_75);
    this.jobContent = jobContent;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  public void setConnectionFee(BigDecimal connectionFee) {
    Objects.requireNonNull(connectionFee, Constant.PT_76);
    this.connectionFee = connectionFee;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, Constant.PT_77);
    this.note = note;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Settlement create(@NonNull Consumer<SettlementBuilder> builder) {
    var instance = new SettlementBuilder();
    builder.accept(instance);
    return instance.build();
  }
  // </editor-fold>

  // <editor-fold> desc="builder"
  public static class SettlementBuilder {
    private final Settlement instance = new Settlement();

    public SettlementBuilder jobContent(String jobContent) {
      instance.setJobContent(jobContent);
      return this;
    }

    public SettlementBuilder registrationAt(LocalDate address) {
      instance.setRegistrationAt(address);
      return this;
    }

    public SettlementBuilder address(String address) {
      instance.setAddress(address);
      return this;
    }

    public SettlementBuilder status(ProcessingStatus address) {
      instance.setStatus(address);
      return this;
    }

    public SettlementBuilder connectionFee(BigDecimal connectionFee) {
      instance.setConnectionFee(connectionFee);
      return this;
    }

    public SettlementBuilder note(String note) {
      instance.setNote(note);
      return this;
    }

    public Settlement build() {
      return instance;
    }
  }
  // </editor-fold>
}
