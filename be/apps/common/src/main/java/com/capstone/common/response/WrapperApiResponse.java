package com.capstone.common.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard API response wrapper including status, message, and result data.")
public record WrapperApiResponse(
        @Schema(description = "HTTP status code of the response", example = "200") int status,
        @Schema(description = "Detailed message about the result", example = "Success") String message,
        @Schema(description = "Response result data. Its structure varies depending on the endpoint.", nullable = true) Object data,
        @Schema(description = "Timestamp when the response was generated") LocalDateTime timestamp) {
}
