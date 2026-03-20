package com.capstone.construction.application.dto.response.material;

public record MaterialsOfCostEstimateResponse(
  String id,
  String jobContent, // noi dung cong viec
  String note,
  String unitName, // don vi tinh
  Float reductionCoefficient, // he so giam
  Float mass, // khoi luong
  String materialCost, // gia vat tu
  String laborPrice, // gia nhan cong
  String laborPriceAtRuralCommune,
  String totalMaterialCost, // tien vat tu
  String totalLaborCost // tien nhan cong
) {
}
