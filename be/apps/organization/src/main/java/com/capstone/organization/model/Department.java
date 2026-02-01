package com.capstone.organization.model;

import jakarta.persistence.*;

import com.capstone.organization.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String departmentId;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false, unique = true)
  String phoneNumber;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.ORG_04);
    this.name = name;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, Constant.ORG_08);
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.ORG_10);
    }
    this.phoneNumber = phoneNumber;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Department create(@NonNull Consumer<DepartmentBuilder> builder) {
    var instance = new DepartmentBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class DepartmentBuilder {
    private final Department instance = new Department();

    public DepartmentBuilder name(String name) {
      instance.setName(name);
      return this;
    }

    public DepartmentBuilder phoneNumber(String phoneNumber) {
      instance.setPhoneNumber(phoneNumber);
      return this;
    }

    public Department build() {
      return instance;
    }
  }
}
