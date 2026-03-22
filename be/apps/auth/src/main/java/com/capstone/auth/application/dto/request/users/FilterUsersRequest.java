package com.capstone.auth.application.dto.request.users;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object containing filter criteria for retrieving users")
public record FilterUsersRequest(
  @Schema(description = "Filter users based on their enabled status. Null to ignore filter.", example = "true")
  Boolean isEnabled,

  @Schema(description = "Exact username to search for.", example = "admin")
  String username
) {
}
