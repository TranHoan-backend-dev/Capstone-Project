package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Unit {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "unit_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

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
    Objects.requireNonNull(name, Constant.ENT_01);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_01);
    }
    this.name = name;
  }

  public static Unit create(@NonNull Consumer<CalculationUnitBuilder> consumer) {
    var builder = new CalculationUnitBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class CalculationUnitBuilder {
    private final Unit unit = new Unit();

    public CalculationUnitBuilder name(String name) {
      unit.setName(name);
      return this;
    }

    public Unit build() {
      return unit;
    }
  }
}
