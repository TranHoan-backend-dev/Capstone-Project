package com.capstone.device.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import org.jspecify.annotations.NonNull;
import org.springframework.web.multipart.MultipartFile;

public record UsageHistoryRequest(
  @NonNull
  MultipartFile image,

  @NotEmpty
  @NotBlank
  @Positive
  Long index
) {
}
