package com.capstone.device.application.dto.response.material;

import java.math.BigDecimal;

public record MaterialsListResponse(
  String id,
  String jobContent,
  String note,
  String unitName,
  Float mass,
  BigDecimal materialCost,
  BigDecimal laborPrice,
  BigDecimal laborPriceAtRuralCommune,
  Float totalLaborCost,
  Float totalMaterialCost
) {
}
