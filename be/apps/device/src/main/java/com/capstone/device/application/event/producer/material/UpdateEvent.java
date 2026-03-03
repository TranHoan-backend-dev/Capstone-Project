package com.capstone.device.application.event.producer.material;

import java.math.BigDecimal;

public record UpdateEvent(
  String oldJobContent,
  BigDecimal oldPrice,
  BigDecimal oldLaborPrice,
  BigDecimal oldLaborPriceAtRuralCommune,
  BigDecimal oldConstructionMachineryPrice,
  BigDecimal oldConstructionMachineryPriceAtRuralCommune,
  String oldGroupName,
  String oldUnitName,
  String newJobContent,
  BigDecimal newPrice,
  BigDecimal newLaborPrice,
  BigDecimal newLaborPriceAtRuralCommune,
  BigDecimal newConstructionMachineryPrice,
  BigDecimal newConstructionMachineryPriceAtRuralCommune,
  String newGroupName,
  String newUnitName) {
}
