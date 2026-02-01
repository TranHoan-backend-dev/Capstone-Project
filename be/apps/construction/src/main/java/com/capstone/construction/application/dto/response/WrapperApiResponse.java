package com.capstone.construction.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Standard API Response format")
public record WrapperApiResponse(
    @Schema(description = "HTTP Status Code", example = "200") int status,

    @Schema(description = "Response message", example = "Operation successful") String message,

    @Schema(description = "Response data payload") Object data,

    @Schema(description = "Response timestamp") LocalDateTime timestamp) {
}
