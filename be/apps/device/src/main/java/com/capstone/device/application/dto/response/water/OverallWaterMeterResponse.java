package com.capstone.device.application.dto.response.water;

public record OverallWaterMeterResponse(
  String serial,
  String name,
  String lateralId
) {
}
