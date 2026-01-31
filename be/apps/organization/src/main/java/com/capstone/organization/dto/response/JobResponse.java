package com.capstone.organization.dto.response;

import java.time.LocalDateTime;

public record JobResponse(
  String jobId,
  String name,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {
}
