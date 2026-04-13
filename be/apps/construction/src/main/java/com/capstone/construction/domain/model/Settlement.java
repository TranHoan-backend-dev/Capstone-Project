package com.capstone.construction.domain.model;

import com.capstone.construction.domain.model.utils.significance.SettlementSignificance;
import jakarta.persistence.*;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
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

  @Column(name = "created_at", nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false)
  LocalDate registrationAt;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  SettlementSignificance significance;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumns({
    @JoinColumn(name = "installation_form_code", referencedColumnName = "form_code", nullable = false),
    @JoinColumn(name = "installation_form_number", referencedColumnName = "form_number", nullable = false)
  })
  InstallationForm installationForm;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
    this.significance = new SettlementSignificance();
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // <editor-fold> desc="setter"
  public void setRegistrationAt(@NonNull LocalDate value) {
    Objects.requireNonNull(value, Message.PT_04);
    this.registrationAt = value;
  }

  public void setInstallationForm(@NonNull InstallationForm value) {
    Objects.requireNonNull(value, Message.PT_40);
    this.installationForm = value;
  }

  public void setJobContent(String jobContent) {
    requireNonNullAndNotEmpty(jobContent, SharedMessage.MES_14);
    this.jobContent = jobContent;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, SharedMessage.MES_06);
    this.address = address;
  }

  public void setConnectionFee(BigDecimal connectionFee) {
    Objects.requireNonNull(connectionFee, Message.PT_50);
    this.connectionFee = connectionFee;
  }

  public void setNote(String note) {
    this.note = note == null ? "" : note.trim();
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

    public SettlementBuilder connectionFee(BigDecimal connectionFee) {
      instance.setConnectionFee(connectionFee);
      return this;
    }

    public SettlementBuilder installationForm(InstallationForm value) {
      instance.setInstallationForm(value);
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
