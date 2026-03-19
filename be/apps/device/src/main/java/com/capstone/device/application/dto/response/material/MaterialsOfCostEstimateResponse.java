package com.capstone.device.application.dto.response.material;

public record MaterialsOfCostEstimateResponse(
  String materialId,
  String price,
  String laborCost,
  String totalLaborCost,
  String materialCost,
  String totalMaterialCost,
  String note,
  Float mass,
  Float reductionCoefficient
) {
}
