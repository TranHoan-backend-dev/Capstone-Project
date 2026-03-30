package com.capstone.device.application.dto.request;

import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.NonNull;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UsageHistoryRequest(
  @NonNull MultipartFile image,

  @NotNull BigDecimal index,

  @NotNull LocalDate recordingDate
) {
}
