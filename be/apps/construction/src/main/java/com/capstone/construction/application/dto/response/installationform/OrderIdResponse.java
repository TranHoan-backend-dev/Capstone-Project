package com.capstone.construction.application.dto.response.installationform;

import lombok.Builder;

@Builder
public record OrderIdResponse(
  Long formCode,
  Long formNumber
) {
}
