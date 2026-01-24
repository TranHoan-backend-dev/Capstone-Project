package com.capstone.organization.model;

import jakarta.persistence.*;
import com.capstone.organization.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  String employeeId;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.ORG_04);
    this.name = name;
  }

  public void setEmployeeId(String employeeId) {
    requireNonNullAndNotEmpty(employeeId, Constant.ORG_09);
    this.employeeId = employeeId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Job create(Consumer<JobBuilder> builder) {
    var instance = new JobBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class JobBuilder {
    private String name;
    private String employeeId;

    public JobBuilder name(String name) {
      this.name = name;
      return this;
    }

    public JobBuilder employeeId(String employeeId) {
      this.employeeId = employeeId;
      return this;
    }

    public Job build() {
      var job = new Job();
      job.setName(name);
      job.setEmployeeId(employeeId);
      return job;
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
