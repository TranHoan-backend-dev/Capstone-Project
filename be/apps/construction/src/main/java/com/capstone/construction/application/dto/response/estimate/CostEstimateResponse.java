package com.capstone.construction.application.dto.response.estimate;

import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.InstallationFormId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record CostEstimateResponse(
  GeneralInformation generalInformation,
  List<BaseMaterial> materials
) {
  public record Significance(
    String companyLeaderShip,
    String surveyStaff,
    String planningTechnicalHead
  ) {
  }
  public record GeneralInformation(
    String estimationId,
    String customerName,
    String address,
    String note,
    Integer contractFee,
    Integer surveyFee,
    Integer surveyEffort,
    Integer installationFee,
    Double laborCoefficient,
    Double generalCostCoefficient,
    Double precalculatedTaxCoefficient,
    Double constructionMachineryCoefficient,
    Double vatCoefficient,
    Double designCoefficient,
    Integer designFee,
    String designImageUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDate registrationAt,
    String createBy,
    String waterMeterSerial,
    String waterMeterType,
    String overallWaterMeterId,
    String overallWaterMeterName,
    String meterTypeId,
    InstallationFormId installationFormId,
    FormProcessingStatus status,
    Significance significance
  ) {

  }
}
