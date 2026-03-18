package com.capstone.construction.domain.model;

import com.capstone.construction.domain.model.utils.Significance;
import jakarta.persistence.*;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
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

  Integer contractFee;

  Integer surveyFee;

  Integer surveyEffort;

  Integer installationFee;

  Integer laborCoefficient;

  Integer generalCostCoefficient;

  Integer precalculatedTaxCoefficient;

  Integer constructionMachineryCoefficient;

  Integer vatCoefficient;

  Integer designCoefficient;

  Integer designFee;

  String designImageUrl;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Column(nullable = false)
  LocalDate registrationAt;

  @Column(nullable = false)
  String createBy; // reference to Users, describe which employee has been processing

  String waterMeterSerial;

  @Column(nullable = false)
  String overallWaterMeterId;

  @OneToOne
  InstallationForm installationForm;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  Significance significance;

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
  public void setRegistrationAt(@NonNull LocalDate value) {
    Objects.requireNonNull(value, Message.PT_04);
    this.registrationAt = value;
  }

  public void setInstallationForm(InstallationForm value) {
    Objects.requireNonNull(value, Message.PT_41);
    this.installationForm = value;
  }

  public void setSignificance(Significance value) {
    Objects.requireNonNull(value, Message.PT_64);
    this.significance = value;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Message.PT_14);
    this.customerName = customerName;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, SharedMessage.MES_06);
    this.address = address;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, SharedMessage.MES_08);
    this.note = note;
  }

  public void setContractFee(Integer contractFee) {
    Objects.requireNonNull(contractFee, Message.PT_15);
    this.contractFee = contractFee;
  }

  public void setSurveyFee(Integer surveyFee) {
    Objects.requireNonNull(surveyFee, Message.PT_16);
    this.surveyFee = surveyFee;
  }

  public void setSurveyEffort(Integer surveyEffort) {
    Objects.requireNonNull(surveyEffort, Message.PT_17);
    this.surveyEffort = surveyEffort;
  }

  public void setInstallationFee(Integer installationFee) {
    Objects.requireNonNull(installationFee, SharedMessage.MES_15);
    this.installationFee = installationFee;
  }

  public void setLaborCoefficient(Integer laborCoefficient) {
    Objects.requireNonNull(laborCoefficient, Message.PT_18);
    this.laborCoefficient = laborCoefficient;
  }

  public void setGeneralCostCoefficient(Integer generalCostCoefficient) {
    Objects.requireNonNull(generalCostCoefficient, Message.PT_19);
    this.generalCostCoefficient = generalCostCoefficient;
  }

  public void setPrecalculatedTaxCoefficient(Integer precalculatedTaxCoefficient) {
    Objects.requireNonNull(precalculatedTaxCoefficient, Message.PT_20);
    this.precalculatedTaxCoefficient = precalculatedTaxCoefficient;
  }

  public void setConstructionMachineryCoefficient(Integer constructionMachineryCoefficient) {
    Objects.requireNonNull(constructionMachineryCoefficient, Message.PT_21);
    this.constructionMachineryCoefficient = constructionMachineryCoefficient;
  }

  public void setVatCoefficient(Integer vatCoefficient) {
    Objects.requireNonNull(vatCoefficient, Message.PT_22);
    this.vatCoefficient = vatCoefficient;
  }

  public void setDesignCoefficient(Integer designCoefficient) {
    Objects.requireNonNull(designCoefficient, Message.PT_23);
    this.designCoefficient = designCoefficient;
  }

  public void setDesignFee(Integer designFee) {
    Objects.requireNonNull(designFee, Message.PT_24);
    this.designFee = designFee;
  }

  public void setDesignImageUrl(String designImageUrl) {
    requireNonNullAndNotEmpty(designImageUrl, Message.PT_25);
    this.designImageUrl = designImageUrl;
  }

  public void setCreateBy(String createBy) {
    requireNonNullAndNotEmpty(createBy, Message.PT_26);
    this.createBy = createBy;
  }

  public void setWaterMeterSerial(String waterMeterId) {
    requireNonNullAndNotEmpty(waterMeterId, Message.PT_27);
    this.waterMeterSerial = waterMeterId;
  }

  public void setOverallWaterMeterId(String overallWaterMeterId) {
    requireNonNullAndNotEmpty(overallWaterMeterId, Message.PT_37);
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

    public EstimationBuilder installationForm(InstallationForm value) {
      instance.setInstallationForm(value);
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
