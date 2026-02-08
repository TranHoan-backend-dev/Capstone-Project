package com.capstone.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object representing a department")
public record DepartmentResponse(
    @Schema(description = "Encoded department ID", example = "DEPT001") String departmentId,
    @Schema(description = "Name of the department", example = "Human Resources") String name,
    @Schema(description = "Phone number of the department", example = "0123456789") String phoneNumber) {
}
