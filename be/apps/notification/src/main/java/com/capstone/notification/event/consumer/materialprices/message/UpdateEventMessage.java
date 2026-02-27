package com.capstone.notification.event.consumer.materialprices.message;

import java.math.BigDecimal;

public record UpdateEventMessage(
  String pattern,
  MaterialEventData data) {
  public record MaterialEventData(
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
}
