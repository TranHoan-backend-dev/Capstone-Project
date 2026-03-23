package com.capstone.construction.application.dto.request.construction;

public record AssignRequest(
  String formCode,
  String formNumber,
  String customerId,
  String contractId
) {
}
