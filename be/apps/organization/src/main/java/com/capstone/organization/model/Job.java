package com.capstone.organization.model;

import jakarta.persistence.*;
import com.capstone.organization.config.Constant;
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
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Job {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "job_id")
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
    requireNonNullAndNotEmpty(name, Constant.ORG_04);
    this.name = name;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Job create(@NonNull Consumer<JobBuilder> builder) {
    var instance = new JobBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class JobBuilder {
    private String name;

    public JobBuilder name(String name) {
      this.name = name;
      return this;
    }

    public Job build() {
      var job = new Job();
      job.setName(name);
      return job;
    }
  }
}
