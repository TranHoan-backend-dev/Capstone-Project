package com.capstone.customer.dto.response;

import java.time.LocalDate;

public record WaterMeterInfoResponse(
  String id,
  LocalDate installationDate,
  Integer size,
  String typeName
) {
}
