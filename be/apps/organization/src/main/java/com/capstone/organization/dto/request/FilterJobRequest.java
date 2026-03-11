package com.capstone.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "Yêu cầu lọc danh sách công việc")
public record FilterJobRequest(
  @Schema(description = "Tìm kiếm theo tên công việc (hỗ trợ tiếng Việt không dấu)", example = "ky su")
  String name,
  @Schema(description = "Lọc từ ngày (định dạng yyyy-MM-dd)", example = "2024-01-01")
  LocalDate fromDate,
  @Schema(description = "Lọc đến ngày (định dạng yyyy-MM-dd)", example = "2024-12-31")
  LocalDate toDate
) {
}
