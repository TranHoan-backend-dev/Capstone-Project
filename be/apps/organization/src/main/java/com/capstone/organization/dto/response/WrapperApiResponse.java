package com.capstone.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Standard API response wrapper")
public record WrapperApiResponse(
    @Schema(description = "HTTP status code", example = "200") int status,
    @Schema(description = "Response message", example = "Success") String message,
    @Schema(description = "Response data") Object data,
    @Schema(description = "Response timestamp") LocalDateTime timestamp) {
}
