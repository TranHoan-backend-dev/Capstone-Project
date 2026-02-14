package com.capstone.construction.application.dto.response.installationform;

public record InstallationFormListResponse(
  String formCode,
  String formNumber,
  String customerName,
  String address,
  String phoneNumber,
  String scheduleSurveyAt,
  String registrationAt,
  String surveyEmployeeName
) {
}
