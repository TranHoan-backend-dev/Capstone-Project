package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record SignupRequest(
  String username,

  @Pattern(regexp = Constant.PASSWORD_PATTERN, message = Constant.PT_02)
  String password,

  @Email(message = Constant.PT_01)
  String email,

  Boolean status,
  String jobId,
  String businessPageIds,
  String departmentId,
  String waterSupplyNetworkId
) {
}
