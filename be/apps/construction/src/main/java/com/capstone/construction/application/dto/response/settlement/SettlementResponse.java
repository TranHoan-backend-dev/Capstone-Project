package com.capstone.construction.application.dto.response.settlement;

import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.significance.SettlementSignificance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record SettlementResponse(
  GeneralInformation generalInformation,
  List<BaseMaterial> baseMaterials
) {
  public record GeneralInformation(
    String settlementId,
    String jobContent,
    String customerName,
    String address,
    BigDecimal connectionFee,
    String note,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDate registrationAt,
    String formCode,
    String formNumber,
    SettlementSignificance significance,
    FormProcessingStatus status
  ) {

  }
}
