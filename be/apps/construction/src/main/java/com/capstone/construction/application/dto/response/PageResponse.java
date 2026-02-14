package com.capstone.construction.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record PageResponse<T>(
  @Schema(description = "List of data for the current page") List<T> content,

  @Schema(description = "Current page number (0-indexed)", example = "0") int pageNumber,

  @Schema(description = "Number of elements per page", example = "10") int pageSize,

  @Schema(description = "Total number of elements across all pages", example = "50") long totalElements,

  @Schema(description = "Total number of pages", example = "5") int totalPages,

  @Schema(description = "Whether this is the last page", example = "false") boolean last) {
  public static <T, U> PageResponse<T> fromPage(org.springframework.data.domain.Page<U> page,
                                                java.util.function.Function<U, T> mapper) {
    return new PageResponse<>(
      page.getContent().stream().map(mapper).toList(),
      page.getNumber(),
      page.getSize(),
      page.getTotalElements(),
      page.getTotalPages(),
      page.isLast());
  }
}
