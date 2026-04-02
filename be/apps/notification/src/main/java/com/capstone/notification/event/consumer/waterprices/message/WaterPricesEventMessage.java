package com.capstone.notification.event.consumer.waterprices.message;

import java.math.BigDecimal;
import java.time.LocalDate;

public record WaterPricesEventMessage(
  WaterPriceEventData data,
  String pattern
) {
  public record WaterPriceEventData(
    String oldUserTarget,
    BigDecimal oldTax,
    BigDecimal oldEnvironmentPrice,
    LocalDate oldApplicationPeriod,
    LocalDate oldExpirationDate,
    String oldDescription,
    String newUserTarget,
    BigDecimal newTax,
    BigDecimal newEnvironmentPrice,
    LocalDate newApplicationPeriod,
    LocalDate newExpirationDate,
    String newDescription,
    String action
  ) {
  }
}
