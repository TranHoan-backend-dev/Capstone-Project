package com.capstone.device.application.event.producer.material;

import java.math.BigDecimal;

public record DeleteEvent(
  String jobContent,
  BigDecimal price,
  BigDecimal laborPrice,
  BigDecimal laborPriceAtRuralCommune,
  BigDecimal constructionMachineryPrice,
  BigDecimal constructionMachineryPriceAtRuralCommune,
  String groupName,
  String unitName) {
}
