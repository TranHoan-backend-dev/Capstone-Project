package com.capstone.device.application.dto.response.material;

import java.math.BigDecimal;

public record MaterialsOfCostEstimateResponse(
  String id,
  String jobContent,
  String note,
  String unitName,
  Float reductionCoefficient,
  Float mass,
  BigDecimal materialCost,
  BigDecimal laborPrice,
  BigDecimal laborPriceAtRuralCommune,
  Float totalLaborCost,
  Float totalMaterialCost
) {
}
