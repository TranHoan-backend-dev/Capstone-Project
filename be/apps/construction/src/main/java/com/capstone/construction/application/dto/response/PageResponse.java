package com.capstone.construction.application.dto.response;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public record PageResponse<T>(
  List<T> content,
  int pageNumber,
  int pageSize,
  long totalElements,
  int totalPages,
  boolean last
) {
  public static <T, U> @NonNull PageResponse<T> fromPage(@NonNull Page<U> page, Function<U, T> mapper) {
    return new PageResponse<>(
      page.getContent().stream().map(mapper).toList(),
      page.getNumber(),
      page.getSize(),
      page.getTotalElements(),
      page.getTotalPages(),
      page.isLast());
  }
}
