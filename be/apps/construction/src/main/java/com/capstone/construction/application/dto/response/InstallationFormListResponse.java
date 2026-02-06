package com.capstone.construction.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

public record InstallationFormListResponse(
        @Schema(description = "List of forms that have been assigned (handoverBy is not empty)") Page<InstallationFormResponse> assignedForms,

        @Schema(description = "List of forms that are pending assignment (handoverBy is empty)") Page<InstallationFormResponse> unassignedForms) {
}
