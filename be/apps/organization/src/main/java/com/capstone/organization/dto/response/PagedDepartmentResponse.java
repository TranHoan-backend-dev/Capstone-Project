package com.capstone.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Paged response for departments")
public record PagedDepartmentResponse(
    @Schema(description = "List of departments") List<DepartmentResponse> items,
    @Schema(description = "Current page index (0-based)", example = "0") int page,
    @Schema(description = "Page size", example = "10") int size,
    @Schema(description = "Total items available", example = "100") long totalItems,
    @Schema(description = "Total pages available", example = "10") int totalPages) {
}
