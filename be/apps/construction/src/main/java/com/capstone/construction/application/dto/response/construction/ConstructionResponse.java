package com.capstone.construction.application.dto.response.construction;

import lombok.Builder;

@Builder
public record ConstructionResponse(
  String id,
  String contractId,
  String formCode,
  String formNumber,
  String isApproved,
  String createdAt
) {
}
