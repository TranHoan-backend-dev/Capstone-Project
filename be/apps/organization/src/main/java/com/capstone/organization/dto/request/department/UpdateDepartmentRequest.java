package com.capstone.organization.dto.request.department;

import com.capstone.common.utils.SharedConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import com.capstone.organization.utils.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request to update an existing department")
public record UpdateDepartmentRequest(
  @Schema(description = "Name of the department", example = "Human Resources")
  @NotBlank String name,

  @Schema(description = "Phone number of the department", example = "0123456789")
  @NotBlank @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = Constant.ORG_10)
  String phoneNumber
) {
}
