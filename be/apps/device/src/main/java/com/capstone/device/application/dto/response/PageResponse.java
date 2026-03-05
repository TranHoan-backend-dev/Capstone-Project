package com.capstone.device.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public record PageResponse<T>(
  @Schema(description = "Danh sách dữ liệu cho trang hiện tại") List<T> content,

  @Schema(description = "Số trang hiện tại (bắt đầu từ 0)", example = "0") int pageNumber,

  @Schema(description = "Số lượng phần tử trên mỗi trang", example = "10") int pageSize,

  @Schema(description = "Tổng số phần tử trên tất cả các trang", example = "50") long totalElements,

  @Schema(description = "Tổng số trang", example = "5") int totalPages,

  @Schema(description = "Cho biết đây có phải là trang cuối cùng không", example = "false") boolean last) {
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
