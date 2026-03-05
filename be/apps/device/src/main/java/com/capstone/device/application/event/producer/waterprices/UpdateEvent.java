package com.capstone.device.application.event.producer.waterprices;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateEvent(
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
  String newDescription
) {
}
