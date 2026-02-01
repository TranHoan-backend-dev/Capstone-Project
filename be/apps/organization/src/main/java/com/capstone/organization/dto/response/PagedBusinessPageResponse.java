package com.capstone.organization.dto.response;

import java.util.List;

public record PagedBusinessPageResponse(
  List<BusinessPageResponse> items,
  int page,
  int size,
  long totalItems,
  int totalPages
) {
}
