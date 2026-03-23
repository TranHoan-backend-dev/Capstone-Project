package com.capstone.device.application.dto.response.pricetype;

import java.math.BigDecimal;
import java.util.Map;

public record PriceTypeResponse(
  String priceTypeId,
  String area,
  Map<String, BigDecimal> price
) {
}
