package com.capstone.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object representing a business page")
public record BusinessPageResponse(
    @Schema(description = "Encoded business page ID", example = "BP001") String pageId,
    @Schema(description = "Name of the business page", example = "Sales Department") String name,
    @Schema(description = "Activation status", example = "true") Boolean activate,
    @Schema(description = "Creator of the page", example = "admin") String creator,
    @Schema(description = "Updator of the page", example = "admin") String updator) {
}
