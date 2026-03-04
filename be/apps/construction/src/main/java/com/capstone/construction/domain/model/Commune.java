package com.capstone.construction.domain.model;

import com.capstone.common.utils.TextNormalizer;
import com.capstone.construction.domain.enumerate.CommuneType;
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
public class Commune {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String communeId;

  @Column(nullable = false, unique = true)
  String name;

  /**
   * Normalized name for accent-insensitive search.
   * Nullable for backward compatibility with existing DB rows (ddl-auto=update).
   */
  @Column
  String nameSearch;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  CommuneType type;

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
    Objects.requireNonNull(name, Constant.PT_21);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.PT_21);
    }
    this.name = name;
    this.nameSearch = TextNormalizer.normalizeForSearch(name);
  }

  public void setType(CommuneType type) {
    Objects.requireNonNull(type, Constant.PT_22);
    this.type = type;
  }

  public static Commune create(@NonNull Consumer<CommuneBuilder> builder) {
    var instance = new CommuneBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class CommuneBuilder {
    private final Commune instance = new Commune();

    public CommuneBuilder name(String name) {
      instance.setName(name);
      return this;
    }

    public CommuneBuilder type(CommuneType type) {
      instance.setType(type);
      return this;
    }

    public Commune build() {
      return instance;
    }
  }
}
