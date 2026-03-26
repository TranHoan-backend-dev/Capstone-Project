package com.capstone.device.application.business.usagehistory;

import java.math.BigDecimal;

public record WaterChargeBreakdown(
  BigDecimal waterAmount,
  BigDecimal environmentFee,
  BigDecimal taxAmount,
  BigDecimal totalAmount
) {
}
