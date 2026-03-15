package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.utils.Message;
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
public class Road {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "road_id")
  String roadId;

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
    Objects.requireNonNull(name, Message.PT_47);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Message.PT_47);
    }
    this.name = name;
  }

  public static Road create(@NonNull Consumer<RoadBuilder> builder) {
    var instance = new RoadBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class RoadBuilder {
    private String name;

    public RoadBuilder name(String name) {
      this.name = name;
      return this;
    }

    public Road build() {
      var road = new Road();
      road.setName(name);
      return road;
    }
  }
}
