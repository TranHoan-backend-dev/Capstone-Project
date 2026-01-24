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
public class InstallationContract {
  @EmbeddedId
  ContractId id;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId("customerId")
  Customer customer;

  String installationFormId;

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

  public void setInstallationFormId(String value) {
    Objects.requireNonNull(value, Constant.ENT_09);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_09);
    }
    this.installationFormId = value;
  }

  public static InstallationContract create(@NonNull Consumer<ContractBuilder> consumer) {
    var builder = new ContractBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class ContractBuilder {
    private final InstallationContract installationContract = new InstallationContract();

    public ContractBuilder customer(Customer customer) {
      installationContract.setCustomer(customer);
      return this;
    }

    public ContractBuilder id(ContractId id) {
      installationContract.setId(id);
      return this;
    }

    public InstallationContract build() {
      return installationContract;
    }
  }
}
