package com.capstone.auth.application.dto.response;

public record EmployeeResponse(
  String id,
  String username,
  String fullName,
  String departmentName,
  String networkName,
  String jobs,
  String email
) {
}
