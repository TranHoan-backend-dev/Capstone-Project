package com.capstone.device.application.dto.response.material;

public record MaterialsOfCostEstimateResponse(
  String id,
  String jobContent,
  String note,
  String unitName,
  Float reductionCoefficient,
  Float mass,
  String materialCost,
  String laborPrice,
  String laborPriceAtRuralCommune,
  String totalLaborCost,
  String totalMaterialCost
) {
}
