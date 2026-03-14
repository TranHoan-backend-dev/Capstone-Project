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

  @OneToOne(fetch = FetchType.EAGER)
  Customer customer;

  @Column(nullable = false, unique = true)
  String formCode;

  @Column(nullable = false)
  String formNumber;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  List<Representative> representative;

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

  public void setCustomer(Customer customer) {
    Objects.requireNonNull(customer, Message.ENT_04);
    this.customer = customer;
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

  public void setRepresentative(List<Representative> representative) {
    // Note: Assuming ENT_42 is a constant for "Representatives cannot be null"
    Objects.requireNonNull(representative, "Representatives cannot be null");
    this.representative = representative;
  }

  public static WaterUsageContract create(@NonNull Consumer<ContractBuilder> consumer) {
    var builder = new ContractBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class ContractBuilder {
    private final WaterUsageContract waterUsageContract = new WaterUsageContract();

    public ContractBuilder id(String id) {
      waterUsageContract.setContractId(id);
      return this;
    }

    public ContractBuilder customer(Customer customer) {
      waterUsageContract.setCustomer(customer);
      return this;
    }

    public ContractBuilder formCode(String value) {
      waterUsageContract.setFormCode(value);
      return this;
    }

    public ContractBuilder formNumber(String value) {
      waterUsageContract.setFormCode(value);
      return this;
    }

    public ContractBuilder representative(List<Representative> representative) {
      waterUsageContract.setRepresentative(representative);
      return this;
    }

    public WaterUsageContract build() {
      return waterUsageContract;
    }
  }
}
