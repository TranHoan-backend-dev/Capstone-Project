package com.capstone.construction.application.dto.response.settlement;

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
  String formNumber
) {
}
