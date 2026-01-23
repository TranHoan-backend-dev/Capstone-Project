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
public class Commune {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "commune_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false)
  String type;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.PT_21);
    this.name = name;
  }

  public void setType(String type) {
    requireNonNullAndNotEmpty(type, Constant.PT_22);
    this.type = type;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Commune create(Consumer<CommuneBuilder> builder) {
    var instance = new CommuneBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class CommuneBuilder {
    private String name;
    private String type;

    public CommuneBuilder name(String name) {
      this.name = name;
      return this;
    }

    public CommuneBuilder type(String type) {
      this.type = type;
      return this;
    }

    public Commune build() {
      var commune = new Commune();
      commune.setName(name);
      commune.setType(type);
      return commune;
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
