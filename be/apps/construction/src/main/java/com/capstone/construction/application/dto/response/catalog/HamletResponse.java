package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record HamletResponse(
  String hamletId,
  String name,
  String type,
  String communeId,
  String communeName,
  LocalDateTime createdAt) {
}
