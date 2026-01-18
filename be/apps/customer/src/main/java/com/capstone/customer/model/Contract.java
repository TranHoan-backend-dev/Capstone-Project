package com.capstone.customer.model;

import com.capstone.customer.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

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
public class Contract {
  @EmbeddedId
  ContractId id;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId("customerId")
  Customer customer;

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

  public void setId(ContractId id) {
    Objects.requireNonNull(id, Constant.ENT_12);
    this.id = id;
  }

  public static Contract create(@NonNull Consumer<ContractBuilder> consumer) {
    var builder = new ContractBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class ContractBuilder {
    private final Contract contract = new Contract();

    public ContractBuilder customer(Customer customer) {
      contract.setCustomer(customer);
      return this;
    }

    public ContractBuilder id(ContractId id) {
      contract.setId(id);
      return this;
    }

    public Contract build() {
      return contract;
    }
  }
}
