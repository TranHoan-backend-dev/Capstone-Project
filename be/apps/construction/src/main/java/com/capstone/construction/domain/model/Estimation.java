package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Estimation implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "estimation_id")
  String estimationId;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String address;

  String note;
  @Column(nullable = false)
  Integer contractFee;

  Integer surveyFee;
  Integer surveyEffort;
  Integer installationFee;
  Integer laborCoefficient;
  Integer generalCostCoefficient;
  Integer precalculatedTaxCoefficient;
  Integer constructionMachineryCoefficient;
  Integer varCoefficient;
  Integer designCoefficient;
  Integer designFee;
  String waterMeterType;
  String waterMeterCode;
  //object, obj
  String designImageUrl;
  String customerId;

  @Column(name = "created_date", nullable = false)
  LocalDateTime createdAt;

  @Column(name = "updated_date", nullable = false)
  LocalDateTime updatedAt;


  public static @NonNull Estimation builder(
  ) {
    var user = new Estimation();
//    user.setEmployeeCode(employeeCode);
//    user.setEmail(email);
//    user.setPassword(password);
//    user.setUsername(username);
//    user.setRole(role);
//    user.setBranchId(branchId);
//    user.setDepartmentId(departmentId);
    return user;
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
