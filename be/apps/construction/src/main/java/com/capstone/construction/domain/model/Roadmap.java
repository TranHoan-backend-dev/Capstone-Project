package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Roadmap {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String roadmapId;

  @Column(nullable = false, unique = true)
  String name;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "lateral_id")
  Lateral lateral;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
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
    Objects.requireNonNull(name, Constant.PT_73);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.PT_73);
    }
    this.name = name;
  }

  public void setLateral(Lateral lateral) {
    Objects.requireNonNull(lateral, Constant.PT_74);
    this.lateral = lateral;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Constant.PT_59);
    this.network = network;
  }

  public static Roadmap create(@NonNull Consumer<RoadmapBuilder> builder) {
    var instance = new RoadmapBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class RoadmapBuilder {
    private String name;
    private Lateral lateral;
    private WaterSupplyNetwork network;

    public RoadmapBuilder name(String name) {
      this.name = name;
      return this;
    }

    public RoadmapBuilder lateral(Lateral lateral) {
      this.lateral = lateral;
      return this;
    }

    public RoadmapBuilder network(WaterSupplyNetwork network) {
      this.network = network;
      return this;
    }

    public Roadmap build() {
      var roadmap = new Roadmap();
      roadmap.setName(name);
      roadmap.setLateral(lateral);
      roadmap.setNetwork(network);
      return roadmap;
    }
  }
}
