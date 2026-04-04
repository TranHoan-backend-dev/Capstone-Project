package com.capstone.device.application.dto.request.history;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record AnalysisRequest(
  @NotNull MultipartFile image,
  @NotNull LocalDate recordingDate
) {
}
