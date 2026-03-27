package com.capstone.customer.model;

import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.utils.Message;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.jspecify.annotations.NonNull;

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
public class WaterUsageContract {
  @Id
  String contractId;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false, unique = true)
  String formCode;

  @Column(nullable = false)
  String formNumber;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  List<Representative> representative;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  List<Appendix> appendix;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public void setContractId(String id) {
    Objects.requireNonNull(id, Message.ENT_02);
    this.contractId = id;
  }

  public void setFormCode(String value) {
    Objects.requireNonNull(value, SharedMessage.MES_21);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(SharedMessage.MES_21);
    }
    this.formCode = value;
  }

  public void setFormNumber(String value) {
    Objects.requireNonNull(value, SharedMessage.MES_20);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(SharedMessage.MES_20);
    }
    this.formNumber = value;
  }

  public void setAppendix(List<Appendix> value) {
    Objects.requireNonNull(value, Message.ENT_24);
    this.appendix = value;
  }

  public void setRepresentative(List<Representative> representative) {
    Objects.requireNonNull(representative, "Representatives cannot be null");
    this.representative = representative;
  }
}
