package com.capstone.organization.dto.request.department;

import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import com.capstone.organization.utils.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request to create a new department")
public record CreateDepartmentRequest(
  @Schema(description = "Name of the department", example = "Human Resources")
  @NotBlank
  String name,

  @Schema(description = "Phone number of the department", example = "0123456789")
  @NotBlank
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber
) {
}
