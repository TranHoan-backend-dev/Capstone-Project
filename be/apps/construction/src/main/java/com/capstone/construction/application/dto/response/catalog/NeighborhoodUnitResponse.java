package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record NeighborhoodUnitResponse(
  String unitId,
  String name,
  String communeId,
  String communeName,
  LocalDateTime createdAt) {
}
