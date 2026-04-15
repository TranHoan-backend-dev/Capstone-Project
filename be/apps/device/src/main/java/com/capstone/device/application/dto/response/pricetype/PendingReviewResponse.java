package com.capstone.device.application.dto.response.pricetype;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record PendingReviewResponse(
  String id,
  String serial,
  String customerId,
  String customerName,
  String address,
  BigDecimal oldIndex,
  BigDecimal newIndexAI,
  String imageUrl,
  String status,
  String routeId
) {
}
