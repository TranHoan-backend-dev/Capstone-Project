package com.capstone.notification.event.consumer.materialprices.message;

import java.math.BigDecimal;

public record DeleteEventMessage(
  String pattern,
  MaterialEventData data) {
  public record MaterialEventData(
    String jobContent,
    BigDecimal price,
    BigDecimal laborPrice,
    BigDecimal laborPriceAtRuralCommune,
    BigDecimal constructionMachineryPrice,
    BigDecimal constructionMachineryPriceAtRuralCommune,
    String groupName,
    String unitName) {
  }
}
