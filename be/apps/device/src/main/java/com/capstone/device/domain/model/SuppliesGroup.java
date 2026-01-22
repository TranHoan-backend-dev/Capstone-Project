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
public class SuppliesGroup {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "group_id")
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

  public static SuppliesGroup create(@NonNull Consumer<SuppliesGroupBuilder> consumer) {
    var builder = new SuppliesGroupBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class SuppliesGroupBuilder {
    private final SuppliesGroup group = new SuppliesGroup();

    public SuppliesGroupBuilder name(String name) {
      group.setName(name);
      return this;
    }

    public SuppliesGroup build() {
      return group;
    }
  }
}
