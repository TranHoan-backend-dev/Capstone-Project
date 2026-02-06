package com.capstone.organization.dto.response;

import java.util.List;

public record PagedDepartmentResponse(
  List<DepartmentResponse> items,
  int page,
  int size,
  long totalItems,
  int totalPages
) {
}
