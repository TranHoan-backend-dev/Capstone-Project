package com.capstone.device.application.dto.response.customer;

public record CustomerWaterPriceRefResponse(
  String customerId,
  String name,
  String waterPriceId,
  String waterMeterId
) {
}

