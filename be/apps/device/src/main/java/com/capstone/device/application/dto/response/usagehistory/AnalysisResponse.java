package com.capstone.device.application.dto.response.usagehistory;

import lombok.Builder;

@Builder
public record AnalysisResponse(
  String id,
  String serial,
  String index
) {
}
