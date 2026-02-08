package com.capstone.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Response object representing a job position")
public record JobResponse(
    @Schema(description = "Encoded job ID", example = "JOB001") String jobId,
    @Schema(description = "Name of the job position", example = "Software Engineer") String name,
    @Schema(description = "Creation timestamp") LocalDateTime createdAt,
    @Schema(description = "Last update timestamp") LocalDateTime updatedAt) {
}
