package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Roadmap {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "roadmap_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "lateral_id")
  Lateral lateral;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
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
