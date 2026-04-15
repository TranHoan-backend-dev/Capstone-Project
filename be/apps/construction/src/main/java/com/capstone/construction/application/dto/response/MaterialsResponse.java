package com.capstone.construction.application.dto.response;

public record MaterialsResponse(
  String id,
  String jobContent, // noi dung cong viec
  String note,
  String unitName, // don vi tinh
  Float mass, // khoi luong
  String materialCost, // gia vat tu
  String laborPrice, // gia nhan cong
  String laborPriceAtRuralCommune,
  String totalMaterialCost, // tien vat tu
  String totalLaborCost // tien nhan cong
) {
}
