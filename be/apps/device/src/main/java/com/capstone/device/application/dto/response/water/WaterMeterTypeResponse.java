package com.capstone.device.application.dto.response.water;

import java.time.LocalDateTime;

public record WaterMeterTypeResponse(
  String typeId,
  String name,
  String origin,
  String meterModel,
  Integer size,
  String maxIndex,
  String qn,
  String qt,
  String qmin,
  Float diameter,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {
}
