package com.capstone.device.application.business.usagehistory;

import com.capstone.device.domain.model.WaterPrice;

import java.math.BigDecimal;

public interface WaterChargeCalculator {
  BigDecimal calculateProgressiveCharge(BigDecimal mass, WaterPrice waterPrice);
}

