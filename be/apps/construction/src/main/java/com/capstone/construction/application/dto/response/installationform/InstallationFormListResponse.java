package com.capstone.construction.application.dto.response.installationform;

import com.capstone.construction.domain.model.utils.FormProcessingStatus;

public record InstallationFormListResponse(
  String formCode,
  String formNumber,
  String customerName,
  String address,
  String phoneNumber,
  String scheduleSurveyAt,
  String registrationAt,
  String handoverBy,
  String handoverByFullName,
  String creator,
  String creatorFullName,
  String constructedBy,
  String constructedByFullName,
  FormProcessingStatus status
) {
}
