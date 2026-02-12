package com.capstone.auth.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object representing an employee's basic details")
public record EmployeeResponse(
    @Schema(description = "Unique identifier of the employee", example = "550e8400-e29b-41d4-a716-446655440000") String id,

    @Schema(description = "Username of the employee", example = "jdoe") String username,

    @Schema(description = "Full name of the employee (usually email if name is not set)", example = "john.doe@example.com") String fullname) {
}
