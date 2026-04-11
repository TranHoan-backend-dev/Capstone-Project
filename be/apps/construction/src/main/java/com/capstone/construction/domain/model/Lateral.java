package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

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

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "water_supply_network_id", nullable = false)
  WaterSupplyNetwork network;

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

  public void setName(String name) {
    Objects.requireNonNull(name, Message.PT_45);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Message.PT_45);
    }
    this.name = name;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Message.PT_34);
    this.network = network;
  }

  public static Lateral create(@NonNull Consumer<LateralBuilder> builder) {
    var instance = new LateralBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class LateralBuilder {
    private String name;
    private WaterSupplyNetwork network;

    public LateralBuilder name(String name) {
      this.name = name;
      return this;
    }

    public LateralBuilder network(WaterSupplyNetwork network) {
      this.network = network;
      return this;
    }

    public Lateral build() {
      var lateral = new Lateral();
      lateral.setName(name);
      lateral.setNetwork(network);
      return lateral;
    }
  }
}
