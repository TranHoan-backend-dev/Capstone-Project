package com.capstone.construction.application.dto.response.construction;

import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import lombok.Builder;

@Builder
public record ConstructionResponse(
  String id,
  String contractId,
  InstallationFormListResponse installationForm,
  String isApproved,
  String createdAt
) {
}
