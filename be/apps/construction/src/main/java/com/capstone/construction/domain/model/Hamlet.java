package com.capstone.construction.domain.model;

import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.domain.enumerate.HamletType;
import jakarta.persistence.*;
import com.capstone.construction.infrastructure.utils.Message;
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
public class Hamlet {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String hamletId;

  @Column(nullable = false, unique = true)
  String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  HamletType type;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

  public void setName(String name) {
    Objects.requireNonNull(name, Message.PT_11);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Message.PT_11);
    }
    this.name = name;
  }

  public void setType(HamletType type) {
    Objects.requireNonNull(type, Message.PT_12);
    this.type = type;
  }

  public void setCommune(Commune commune) {
    Objects.requireNonNull(commune, Message.PT_13);
    if (!commune.getType().equals(CommuneType.RURAL_COMMUNE)) {
      throw new IllegalArgumentException(Message.PT_07);
    }
    this.commune = commune;
  }

  public static Hamlet create(@NonNull Consumer<HamletBuilder> builder) {
    var instance = new HamletBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class HamletBuilder {
    private String name;
    private HamletType type;
    private Commune commune;

    public HamletBuilder name(String name) {
      this.name = name;
      return this;
    }

    public HamletBuilder type(HamletType type) {
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
