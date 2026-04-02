package com.capstone.construction.application.dto.response.installationform;

import lombok.Builder;

@Builder
public record OrderIdResponse(
  String formCode,
  String formNumber
) {
}
