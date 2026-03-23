package com.capstone.construction.application.dto.response.settlement;

import com.capstone.construction.domain.model.utils.significance.SettlementSignificance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SettlementResponse(
  String settlementId,
  String jobContent,
  String address,
  BigDecimal connectionFee,
  String note,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,
  LocalDate registrationAt,
  String formCode,
  String formNumber,
  SettlementSignificance significance
) {
}
