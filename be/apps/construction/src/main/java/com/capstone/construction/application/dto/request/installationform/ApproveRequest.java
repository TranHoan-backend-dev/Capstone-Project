package com.capstone.construction.application.dto.request.installationform;

public record ApproveRequest(
  String empId, String formNumber, String formCode, Boolean status
) {
}
