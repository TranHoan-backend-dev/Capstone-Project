package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
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
public class Estimation implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "est_id")
  String estimationId;

  @Column(nullable = false)
  String customerName;

  @Column(nullable = false)
  String address;

  String note;

  @Column(nullable = false)
  Integer contractFee;

  @Column(nullable = false)
  Integer surveyFee;

  @Column(nullable = false)
  Integer surveyEffort;

  @Column(nullable = false)
  Integer installationFee;

  @Column(nullable = false)
  Integer laborCoefficient;

  @Column(nullable = false)
  Integer generalCostCoefficient;

  @Column(nullable = false)
  Integer precalculatedTaxCoefficient;

  @Column(nullable = false)
  Integer constructionMachineryCoefficient;

  @Column(nullable = false)
  Integer vatCoefficient;

  @Column(nullable = false)
  Integer designCoefficient;

  @Column(nullable = false)
  Integer designFee;

  @Column(nullable = false)
  String waterMeterType;

  @Column(nullable = false)
  String waterMeterCode;
  // object, obj

  @Column(nullable = false)
  String designImageUrl;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false)
  String createBy; // reference to Users, describe which employee has been processing

  @Column(nullable = false)
  String waterMeterId;

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Constant.PT_27);
    this.customerName = customerName;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, Constant.PT_77);
    this.note = note;
  }

  public void setContractFee(Integer contractFee) {
    Objects.requireNonNull(contractFee, Constant.PT_28);
    this.contractFee = contractFee;
  }

  public void setSurveyFee(Integer surveyFee) {
    Objects.requireNonNull(surveyFee, Constant.PT_29);
    this.surveyFee = surveyFee;
  }

  public void setSurveyEffort(Integer surveyEffort) {
    Objects.requireNonNull(surveyEffort, Constant.PT_30);
    this.surveyEffort = surveyEffort;
  }

  public void setInstallationFee(Integer installationFee) {
    Objects.requireNonNull(installationFee, Constant.PT_31);
    this.installationFee = installationFee;
  }

  public void setLaborCoefficient(Integer laborCoefficient) {
    Objects.requireNonNull(laborCoefficient, Constant.PT_32);
    this.laborCoefficient = laborCoefficient;
  }

  public void setGeneralCostCoefficient(Integer generalCostCoefficient) {
    Objects.requireNonNull(generalCostCoefficient, Constant.PT_33);
    this.generalCostCoefficient = generalCostCoefficient;
  }

  public void setPrecalculatedTaxCoefficient(Integer precalculatedTaxCoefficient) {
    Objects.requireNonNull(precalculatedTaxCoefficient, Constant.PT_34);
    this.precalculatedTaxCoefficient = precalculatedTaxCoefficient;
  }

  public void setConstructionMachineryCoefficient(Integer constructionMachineryCoefficient) {
    Objects.requireNonNull(constructionMachineryCoefficient, Constant.PT_35);
    this.constructionMachineryCoefficient = constructionMachineryCoefficient;
  }

  public void setVatCoefficient(Integer vatCoefficient) {
    Objects.requireNonNull(vatCoefficient, Constant.PT_36);
    this.vatCoefficient = vatCoefficient;
  }

  public void setDesignCoefficient(Integer designCoefficient) {
    Objects.requireNonNull(designCoefficient, Constant.PT_37);
    this.designCoefficient = designCoefficient;
  }

  public void setDesignFee(Integer designFee) {
    Objects.requireNonNull(designFee, Constant.PT_38);
    this.designFee = designFee;
  }

  public void setWaterMeterType(String waterMeterType) {
    requireNonNullAndNotEmpty(waterMeterType, Constant.PT_39);
    this.waterMeterType = waterMeterType;
  }

  public void setWaterMeterCode(String waterMeterCode) {
    requireNonNullAndNotEmpty(waterMeterCode, Constant.PT_40);
    this.waterMeterCode = waterMeterCode;
  }

  public void setDesignImageUrl(String designImageUrl) {
    requireNonNullAndNotEmpty(designImageUrl, Constant.PT_41);
    this.designImageUrl = designImageUrl;
  }

  public void setCreateBy(String createBy) {
    requireNonNullAndNotEmpty(createBy, Constant.PT_42);
    this.createBy = createBy;
  }

  public void setWaterMeterId(String waterMeterId) {
    requireNonNullAndNotEmpty(waterMeterId, Constant.PT_43);
    this.waterMeterId = waterMeterId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Estimation create(Consumer<EstimationBuilder> builder) {
    var instance = new EstimationBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class EstimationBuilder {
    private String customerName;
    private String address;
    private String note;
    private Integer contractFee;
    private Integer surveyFee;
    private Integer surveyEffort;
    private Integer installationFee;
    private Integer laborCoefficient;
    private Integer generalCostCoefficient;
    private Integer precalculatedTaxCoefficient;
    private Integer constructionMachineryCoefficient;
    private Integer vatCoefficient;
    private Integer designCoefficient;
    private Integer designFee;
    private String waterMeterType;
    private String waterMeterCode;
    private String designImageUrl;
    private String createBy;
    private String waterMeterId;

    public EstimationBuilder customerName(String customerName) {
      this.customerName = customerName;
      return this;
    }

    public EstimationBuilder address(String address) {
      this.address = address;
      return this;
    }

    public EstimationBuilder note(String note) {
      this.note = note;
      return this;
    }

    public EstimationBuilder contractFee(Integer contractFee) {
      this.contractFee = contractFee;
      return this;
    }

    public EstimationBuilder surveyFee(Integer surveyFee) {
      this.surveyFee = surveyFee;
      return this;
    }

    public EstimationBuilder surveyEffort(Integer surveyEffort) {
      this.surveyEffort = surveyEffort;
      return this;
    }

    public EstimationBuilder installationFee(Integer installationFee) {
      this.installationFee = installationFee;
      return this;
    }

    public EstimationBuilder laborCoefficient(Integer laborCoefficient) {
      this.laborCoefficient = laborCoefficient;
      return this;
    }

    public EstimationBuilder generalCostCoefficient(Integer generalCostCoefficient) {
      this.generalCostCoefficient = generalCostCoefficient;
      return this;
    }

    public EstimationBuilder precalculatedTaxCoefficient(Integer precalculatedTaxCoefficient) {
      this.precalculatedTaxCoefficient = precalculatedTaxCoefficient;
      return this;
    }

    public EstimationBuilder constructionMachineryCoefficient(Integer constructionMachineryCoefficient) {
      this.constructionMachineryCoefficient = constructionMachineryCoefficient;
      return this;
    }

    public EstimationBuilder varCoefficient(Integer varCoefficient) {
      this.vatCoefficient = varCoefficient;
      return this;
    }

    public EstimationBuilder designCoefficient(Integer designCoefficient) {
      this.designCoefficient = designCoefficient;
      return this;
    }

    public EstimationBuilder designFee(Integer designFee) {
      this.designFee = designFee;
      return this;
    }

    public EstimationBuilder waterMeterType(String waterMeterType) {
      this.waterMeterType = waterMeterType;
      return this;
    }

    public EstimationBuilder waterMeterCode(String waterMeterCode) {
      this.waterMeterCode = waterMeterCode;
      return this;
    }

    public EstimationBuilder designImageUrl(String designImageUrl) {
      this.designImageUrl = designImageUrl;
      return this;
    }

    public EstimationBuilder createBy(String createBy) {
      this.createBy = createBy;
      return this;
    }

    public EstimationBuilder waterMeterId(String waterMeterId) {
      this.waterMeterId = waterMeterId;
      return this;
    }

    public Estimation build() {
      var estimation = new Estimation();
      estimation.setCustomerName(customerName);
      estimation.setAddress(address);
      estimation.setNote(note);
      estimation.setContractFee(contractFee);
      estimation.setSurveyFee(surveyFee);
      estimation.setSurveyEffort(surveyEffort);
      estimation.setInstallationFee(installationFee);
      estimation.setLaborCoefficient(laborCoefficient);
      estimation.setGeneralCostCoefficient(generalCostCoefficient);
      estimation.setPrecalculatedTaxCoefficient(precalculatedTaxCoefficient);
      estimation.setConstructionMachineryCoefficient(constructionMachineryCoefficient);
      estimation.setVatCoefficient(vatCoefficient);
      estimation.setDesignCoefficient(designCoefficient);
      estimation.setDesignFee(designFee);
      estimation.setWaterMeterType(waterMeterType);
      estimation.setWaterMeterCode(waterMeterCode);
      estimation.setDesignImageUrl(designImageUrl);
      estimation.setCreateBy(createBy);
      estimation.setWaterMeterId(waterMeterId);
      return estimation;
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
