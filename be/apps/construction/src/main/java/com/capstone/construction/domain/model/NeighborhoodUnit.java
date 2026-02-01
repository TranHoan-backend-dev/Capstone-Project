package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

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
public class NeighborhoodUnit {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "unit_id")
  String unitId;

  @Column(nullable = false, unique = true)
  String name;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

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
    Objects.requireNonNull(name, Constant.PT_71);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.PT_71);
    }
    this.name = name;
  }

  public void setCommune(Commune commune) {
    Objects.requireNonNull(commune, Constant.PT_26);
    this.commune = commune;
  }

  public static NeighborhoodUnit create(@NonNull Consumer<NeighborhoodUnitBuilder> builder) {
    var instance = new NeighborhoodUnitBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class NeighborhoodUnitBuilder {
    private String name;
    private Commune commune;

    public NeighborhoodUnitBuilder name(String name) {
      this.name = name;
      return this;
    }

    public NeighborhoodUnitBuilder commune(Commune commune) {
      this.commune = commune;
      return this;
    }

    public NeighborhoodUnit build() {
      var unit = new NeighborhoodUnit();
      unit.setName(name);
      unit.setCommune(commune);
      return unit;
    }
  }
}
