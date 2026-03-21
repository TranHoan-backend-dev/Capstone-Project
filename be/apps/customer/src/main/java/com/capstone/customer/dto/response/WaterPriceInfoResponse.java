package com.capstone.customer.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record WaterPriceInfoResponse(
  String id,
  String usageTarget,
  BigDecimal tax,
  BigDecimal environmentPrice,
  LocalDate applicationPeriod,
  LocalDate expirationDate,
  String description,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {
}

