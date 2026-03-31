package com.capstone.device.application.dto.request.history;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UsageHistoryRequest(
  @NotNull
  BigDecimal index,

  @NotNull LocalDate recordingDate
) {
}
