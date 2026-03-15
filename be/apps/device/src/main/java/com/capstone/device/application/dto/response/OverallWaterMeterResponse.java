package com.capstone.device.application.dto.response;

public record OverallWaterMeterResponse(
  String serial,
  String name,
  String lateralId
) {
}
