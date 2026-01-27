package com.capstone.construction.domain.model;

import com.capstone.construction.domain.model.utils.ProcessingStatus;
import jakarta.persistence.*;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.time.LocalDate;
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
public class CostEstimate implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
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
  String designImageUrl;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  ProcessingStatus status;

  @Column(nullable = false)
  LocalDate registrationAt;

  @Column(nullable = false)
  String createBy; // reference to Users, describe which employee has been processing

  @Column(nullable = false)
  String waterMeterSerial;

  @Column(nullable = false)
  String overallWaterMeterId;

  @Column(nullable = false)
  String installationFormId;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // <editor-fold> desc="setter"
  public void setStatus(@NonNull ProcessingStatus value) {
    requireNonNullAndNotEmpty(value.name(), Constant.PT_03);
    this.status = value;
  }

  public void setRegistrationAt(@NonNull LocalDate value) {
    Objects.requireNonNull(value, Constant.PT_04);
    this.registrationAt = value;
  }

  public void setInstallationFormId(String value) {
    requireNonNullAndNotEmpty(value, Constant.PT_66);
    this.installationFormId = value;
  }

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

  public void setDesignImageUrl(String designImageUrl) {
    requireNonNullAndNotEmpty(designImageUrl, Constant.PT_41);
    this.designImageUrl = designImageUrl;
  }

  public void setCreateBy(String createBy) {
    requireNonNullAndNotEmpty(createBy, Constant.PT_42);
    this.createBy = createBy;
  }

  public void setWaterMeterSerial(String waterMeterId) {
    requireNonNullAndNotEmpty(waterMeterId, Constant.PT_43);
    this.waterMeterSerial = waterMeterId;
  }

  public void setOverallWaterMeterId(String overallWaterMeterId) {
    requireNonNullAndNotEmpty(overallWaterMeterId, Constant.PT_62);
    this.overallWaterMeterId = overallWaterMeterId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static CostEstimate create(@NonNull Consumer<EstimationBuilder> builder) {
    var instance = new EstimationBuilder();
    builder.accept(instance);
    return instance.build();
  }
  // </editor-fold>

  // <editor-fold> desc="builder"
  public static class EstimationBuilder {
    private final CostEstimate instance = new CostEstimate();

    public EstimationBuilder customerName(String customerName) {
      instance.setCustomerName(customerName);
      return this;
    }

    public EstimationBuilder registrationAt(LocalDate address) {
      instance.setRegistrationAt(address);
      return this;
    }

    public EstimationBuilder address(String address) {
      instance.setAddress(address);
      return this;
    }

    public EstimationBuilder status(ProcessingStatus address) {
      instance.setStatus(address);
      return this;
    }

    public EstimationBuilder note(String note) {
      instance.setNote(note);
      return this;
    }

    public EstimationBuilder contractFee(Integer contractFee) {
      instance.setContractFee(contractFee);
      return this;
    }

    public EstimationBuilder surveyFee(Integer surveyFee) {
      instance.setSurveyFee(surveyFee);
      return this;
    }

    public EstimationBuilder surveyEffort(Integer surveyEffort) {
      instance.setSurveyEffort(surveyEffort);
      return this;
    }

    public EstimationBuilder installationFee(Integer installationFee) {
      instance.setInstallationFee(installationFee);
      return this;
    }

    public EstimationBuilder laborCoefficient(Integer laborCoefficient) {
      instance.setLaborCoefficient(laborCoefficient);
      return this;
    }

    public EstimationBuilder generalCostCoefficient(Integer generalCostCoefficient) {
      instance.setGeneralCostCoefficient(generalCostCoefficient);
      return this;
    }

    public EstimationBuilder precalculatedTaxCoefficient(Integer precalculatedTaxCoefficient) {
      instance.setPrecalculatedTaxCoefficient(precalculatedTaxCoefficient);
      return this;
    }

    public EstimationBuilder constructionMachineryCoefficient(Integer constructionMachineryCoefficient) {
      instance.setConstructionMachineryCoefficient(constructionMachineryCoefficient);
      return this;
    }

    public EstimationBuilder vatCoefficient(Integer vatCoefficient) {
      instance.setVatCoefficient(vatCoefficient);
      return this;
    }

    public EstimationBuilder designCoefficient(Integer designCoefficient) {
      instance.setDesignCoefficient(designCoefficient);
      return this;
    }

    public EstimationBuilder installationFormId(String value) {
      instance.setInstallationFormId(value);
      return this;
    }

    public EstimationBuilder designFee(Integer designFee) {
      instance.setDesignFee(designFee);
      return this;
    }

    public EstimationBuilder designImageUrl(String designImageUrl) {
      instance.setDesignImageUrl(designImageUrl);
      return this;
    }

    public EstimationBuilder createBy(String createBy) {
      instance.setCreateBy(createBy);
      return this;
    }

    public EstimationBuilder waterMeterSerial(String waterMeterSerial) {
      instance.setWaterMeterSerial(waterMeterSerial);
      return this;
    }

    public EstimationBuilder overallWaterMeterId(String overallWaterMeterId) {
      instance.setOverallWaterMeterId(overallWaterMeterId);
      return this;
    }

    public CostEstimate build() {
      return instance;
    }
  }
  // </editor-fold>
}
