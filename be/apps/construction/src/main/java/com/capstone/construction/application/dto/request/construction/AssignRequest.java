package com.capstone.construction.application.dto.request.construction;

public record AssignRequest(
  Long formCode,
  Long formNumber,
  String contractId
) {
}
