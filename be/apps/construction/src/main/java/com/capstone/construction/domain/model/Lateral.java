package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "laterals")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lateral {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "lateral_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  String parentLateralId;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.PT_70);
    this.name = name;
  }

  public void setParentLateralId(String parentLateralId) {
    requireNonNullAndNotEmpty(parentLateralId, Constant.PT_79);
    this.parentLateralId = parentLateralId;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Constant.PT_59);
    this.network = network;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Lateral create(Consumer<LateralBuilder> builder) {
    var instance = new LateralBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class LateralBuilder {
    private String name;
    private String parentLateralId;
    private WaterSupplyNetwork network;

    public LateralBuilder name(String name) {
      this.name = name;
      return this;
    }

    public LateralBuilder parentLateralId(String parentLateralId) {
      this.parentLateralId = parentLateralId;
      return this;
    }

    public LateralBuilder network(WaterSupplyNetwork network) {
      this.network = network;
      return this;
    }

    public Lateral build() {
      var lateral = new Lateral();
      lateral.setName(name);
      lateral.setParentLateralId(parentLateralId);
      lateral.setNetwork(network);
      return lateral;
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
