package com.capstone.customer.dto.request.contract;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record ContractFilterRequest(
  @Schema(description = "Từ khóa tìm kiếm trên tất cả các trường (mã hợp đồng, tên khách hàng, số form, số điện thoại...)", example = "HD001")
  String keyword,

  @Schema(description = "Mã hợp đồng", example = "HD001")
  String contractId,

  @Schema(description = "Mã form lắp đặt", example = "F001")
  String formCode,

  @Schema(description = "Số form lắp đặt", example = "12345")
  String formNumber,

  @Schema(description = "ID khách hàng", example = "CUST001")
  String customerId,

  @Schema(description = "Tên khách hàng", example = "Nguyễn Văn A")
  String customerName,

  @Schema(description = "Số điện thoại khách hàng", example = "0901234567")
  String customerPhoneNumber,

  @Schema(description = "Ngày bắt đầu lọc (dd-MM-yyyy HH:mm:ss)", example = "01-01-2023 00:00:00")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d\\s+(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$")
  String from,

  @Schema(description = "Ngày kết thúc lọc (dd-MM-yyyy HH:mm:ss)", example = "31-12-2023 23:59:59")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d\\s+(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$")
  String to,

  @Schema(description = "Danh sách đại diện (JSON array)", example = "[{\"name\": \"John Doe\", \"position\": \"Chủ hộ\"}]")
  List<RepresentativeFilter> representatives,

  @Schema(description = "Danh sách phụ lục (JSON array)", example = "[{\"content\": \"Hợp đồng phụ\", \"time\": \"2026-03-18T00:00:00\"}]")
  List<AppendixFilter> appendix
) {

  public record RepresentativeFilter(
    @Schema(description = "Tên đại diện")
    String name,

    @Schema(description = "Chức vụ đại diện")
    String position
  ) {
  }

  public record AppendixFilter(
    @Schema(description = "Nội dung phụ lục")
    String content,

    @Schema(description = "Thời gian phụ lục (ISO format: yyyy-MM-ddTHH:mm:ss)")
    String time
  ) {
  }
}
