package com.capstone.construction.application.dto.response.material;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MaterialResponse(
  String id,
  String laborCode,
  String jobContent,
  BigDecimal price,
  BigDecimal laborPrice,
  BigDecimal laborPriceAtRuralCommune,
  BigDecimal constructionMachineryPrice,
  BigDecimal constructionMachineryPriceAtRuralCommune,
  String groupName,
  String unitName,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {
}
