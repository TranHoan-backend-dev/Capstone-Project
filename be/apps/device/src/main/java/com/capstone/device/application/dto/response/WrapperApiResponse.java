package com.capstone.device.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

/**
 * Common API response wrapper for Device Service.
 */
@Schema(description = "Standard API response wrapper")
public record WrapperApiResponse(
        @Schema(description = "HTTP status code") int status,

        @Schema(description = "Response message") String message,

        @Schema(description = "Response data") Object data,

        @Schema(description = "Response timestamp") LocalDateTime timestamp) {
}
