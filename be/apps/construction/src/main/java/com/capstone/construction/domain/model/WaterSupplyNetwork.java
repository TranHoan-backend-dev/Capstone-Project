package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
public class WaterSupplyNetwork {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "branch_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.PT_23);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.PT_23);
    }
    this.name = name;
  }

  public static WaterSupplyNetwork create(Consumer<WaterSupplyNetworkBuilder> builder) {
    var instance = new WaterSupplyNetworkBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class WaterSupplyNetworkBuilder {
    private String name;

    public WaterSupplyNetworkBuilder name(String name) {
      this.name = name;
      return this;
    }

    public WaterSupplyNetwork build() {
      var network = new WaterSupplyNetwork();
      network.setName(name);
      return network;
    }
  }

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
