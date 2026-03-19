package com.capstone.construction.application.dto.response.estimate;

import com.capstone.construction.domain.model.utils.InstallationFormId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record CostEstimateResponse(
  GeneralInformation generalInformation,
  List<Material> material
) {
  public record GeneralInformation(
    String estimationId,
    String customerName,
    String address,
    String note,
    Integer contractFee,
    Integer surveyFee,
    Integer surveyEffort,
    Integer installationFee,
    Integer laborCoefficient,
    Integer generalCostCoefficient,
    Integer precalculatedTaxCoefficient,
    Integer constructionMachineryCoefficient,
    Integer vatCoefficient,
    Integer designCoefficient,
    Integer designFee,
    String designImageUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDate registrationAt,
    String createBy,
    String waterMeterSerial,
    String overallWaterMeterId,
    InstallationFormId installationFormId
  ) {

  }

  public record Material(
    String materialCode,
    String jobContent,
    String note,
    String unit,
    String reductionCoefficient,
    String mass,
    String materialCost,
    String laborCost,
    String laborPriceAtRuralCommune,
    String usedLaborCost,
    String totalMaterialCost,
    String totalLaborCost
  ) {

  }
}
