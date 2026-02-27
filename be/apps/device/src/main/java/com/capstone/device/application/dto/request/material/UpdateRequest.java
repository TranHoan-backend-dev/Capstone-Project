package com.capstone.device.application.dto.request.material;

import java.math.BigDecimal;

public record UpdateRequest(
  String jobContent,
  BigDecimal price,
  BigDecimal laborPrice,
  BigDecimal laborPriceAtRuralCommune,
  BigDecimal constructionMachineryPrice,
  BigDecimal constructionMachineryPriceAtRuralCommune,
  String groupId,
  String unitId
) {
}
