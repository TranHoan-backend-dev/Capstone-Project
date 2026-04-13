package com.capstone.device.application.dto.response.water;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record WaterPriceResponse(
  String id,
  String usageTarget,
  BigDecimal tax,
  BigDecimal environmentPrice,
  LocalDate applicationPeriod,
  LocalDate expirationDate,
  String description,
  LocalDateTime createdAt,
  LocalDateTime updatedAt) {
}
