package com.capstone.customer.model;

import com.capstone.customer.config.Constant;
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

  String installationFormId;

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

  public void setCustomer(Customer customer) {
    Objects.requireNonNull(customer, Constant.ENT_11);
    this.customer = customer;
  }

  public void setInstallationFormId(String value) {
    Objects.requireNonNull(value, Constant.ENT_09);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_09);
    }
    this.installationFormId = value;
  }

  public static WaterUsageContract create(@NonNull Consumer<ContractBuilder> consumer) {
    var builder = new ContractBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class ContractBuilder {
    private final WaterUsageContract waterUsageContract = new WaterUsageContract();

    public ContractBuilder customer(Customer customer) {
      waterUsageContract.setCustomer(customer);
      return this;
    }

    public ContractBuilder installationFormId(String installationFormId) {
      waterUsageContract.setInstallationFormId(installationFormId);
      return this;
    }

    public WaterUsageContract build() {
      return waterUsageContract;
    }
  }
}
