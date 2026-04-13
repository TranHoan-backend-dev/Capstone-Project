package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record WaterSupplyNetworkResponse(
  String branchId,
  String name,
  LocalDateTime createdAt) {
}
