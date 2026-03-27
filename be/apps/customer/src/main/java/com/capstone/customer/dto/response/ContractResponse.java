package com.capstone.customer.dto.response;

import com.capstone.customer.model.Representative;

import java.time.LocalDateTime;
import java.util.List;

public record ContractResponse(
  String contractId,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,
  String installationFormId,
  List<Representative> representatives) {
}
