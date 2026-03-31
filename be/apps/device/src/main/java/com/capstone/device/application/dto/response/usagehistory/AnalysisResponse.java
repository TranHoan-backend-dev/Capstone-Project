package com.capstone.device.application.dto.response.usagehistory;

import lombok.Builder;

@Builder
public record AnalysisResponse(
  String serial,
  String index
) {
}
