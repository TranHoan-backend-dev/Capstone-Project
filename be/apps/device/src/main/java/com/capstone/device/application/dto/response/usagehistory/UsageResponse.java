package com.capstone.device.application.dto.response.usagehistory;

import com.capstone.device.application.dto.response.pricetype.PriceTypeResponse;
import com.capstone.device.domain.model.utils.Usage;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record UsageResponse(
  String serial,
  String customerId,
  String customerName,
  List<PriceTypeResponse> priceTypes,
  List<Usage> usagesList,
  BigDecimal tax,
  BigDecimal environmentPrice
) {
}
