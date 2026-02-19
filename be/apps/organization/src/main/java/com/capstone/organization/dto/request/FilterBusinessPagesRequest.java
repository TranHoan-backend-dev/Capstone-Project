package com.capstone.organization.dto.request;

public record FilterBusinessPagesRequest(
  String filter,
  Boolean isActive
) {
}
