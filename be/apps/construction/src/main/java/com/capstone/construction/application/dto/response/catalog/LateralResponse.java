package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record LateralResponse(
  String id,
  String name,
  String networkId,
  String networkName,
  LocalDateTime createdAt) {
}
