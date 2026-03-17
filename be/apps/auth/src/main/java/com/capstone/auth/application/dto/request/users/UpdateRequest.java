package com.capstone.auth.application.dto.request.users;

public record UpdateRequest(
  String name,
  String departmentId,
  String phone,
  Boolean isActive,
  String networkId
) {
}
