package com.capstone.device.application.dto.response.water;

import java.time.LocalDate;

public record WaterMeterResponse(
  String id,
  LocalDate installationDate,
  Integer size,
  String typeName,
  int indexLength) {
}
