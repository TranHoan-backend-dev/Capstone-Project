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
public class Hamlet {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "hamlet_id")
  String id;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false)
  String type;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.PT_24);
    this.name = name;
  }

  public void setType(String type) {
    requireNonNullAndNotEmpty(type, Constant.PT_25);
    this.type = type;
  }

  public void setCommune(Commune commune) {
    Objects.requireNonNull(commune, Constant.PT_26);
    this.commune = commune;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Hamlet create(Consumer<HamletBuilder> builder) {
    var instance = new HamletBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class HamletBuilder {
    private String name;
    private String type;
    private Commune commune;

    public HamletBuilder name(String name) {
      this.name = name;
      return this;
    }

    public HamletBuilder type(String type) {
      this.type = type;
      return this;
    }

    public HamletBuilder commune(Commune commune) {
      this.commune = commune;
      return this;
    }

    public Hamlet build() {
      var hamlet = new Hamlet();
      hamlet.setName(name);
      hamlet.setType(type);
      hamlet.setCommune(commune);
      return hamlet;
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
