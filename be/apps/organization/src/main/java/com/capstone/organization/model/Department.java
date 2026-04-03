package com.capstone.organization.model;

import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;

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

  @Column(unique = true)
  String phoneNumber;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, SharedMessage.MES_05);
    this.name = name;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, SharedMessage.MES_03);
    if (!phoneNumber.matches(SharedConstant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(SharedMessage.MES_04);
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

    public void phoneNumber(String phoneNumber) {
      instance.setPhoneNumber(phoneNumber);
    }

    public Department build() {
      return instance;
    }
  }
}
