package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record RoadResponse(
  String roadId,
  String name,
  LocalDateTime createdAt) {
}
