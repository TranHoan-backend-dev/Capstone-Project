package com.capstone.organization.dto.response;

import java.util.List;

public record PagedJobResponse(
  List<JobResponse> items,
  int page,
  int size,
  long totalItems,
  int totalPages
) {
}
