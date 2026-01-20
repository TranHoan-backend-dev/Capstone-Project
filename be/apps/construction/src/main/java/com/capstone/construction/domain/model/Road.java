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
public class Road {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "road_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.PT_72);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.PT_72);
    }
    this.name = name;
  }

  public void setCommune(Commune commune) {
    Objects.requireNonNull(commune, Constant.PT_26);
    this.commune = commune;
  }

  public static Road create(Consumer<RoadBuilder> builder) {
    var instance = new RoadBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class RoadBuilder {
    private String name;
    private Commune commune;

    public RoadBuilder name(String name) {
      this.name = name;
      return this;
    }

    public RoadBuilder commune(Commune commune) {
      this.commune = commune;
      return this;
    }

    public Road build() {
      var road = new Road();
      road.setName(name);
      road.setCommune(commune);
      return road;
    }
  }

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
}
