package com.capstone.organization.dto.request.page;

public record FilterBusinessPagesRequest(
  String filter,
  Boolean isActive
) {
}
