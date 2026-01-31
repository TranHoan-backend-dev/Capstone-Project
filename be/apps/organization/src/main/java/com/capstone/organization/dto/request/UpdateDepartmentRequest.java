package com.capstone.organization.dto.request;

import com.capstone.organization.config.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateDepartmentRequest(
  @NotBlank String name,
  @NotBlank @Pattern(regexp = Constant.PHONE_PATTERN, message = Constant.ORG_10) String phoneNumber
) {
}
