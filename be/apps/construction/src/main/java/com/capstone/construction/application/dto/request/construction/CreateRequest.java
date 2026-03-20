package com.capstone.construction.application.dto.request.construction;

public record CreateRequest(
  String formCode, String formNumber, String empId, String contractId, String customerId
) {
}
