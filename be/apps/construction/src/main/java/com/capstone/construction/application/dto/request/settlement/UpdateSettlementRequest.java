package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Yêu cầu cập nhật thông tin quyết toán công trình")
public record UpdateSettlementRequest(
  @Schema(description = "Mã biểu mẫu", example = "FORM-001")
  String formCode,

  @Schema(description = "Số biểu mẫu", example = "001")
  String formNumber,

  @Schema(description = "Nội dung công việc", example = "Lắp đặt hệ thống cấp nước D110")
  String jobContent,

  @Schema(description = "Địa chỉ thi công công trình", example = "123 Đường ABC, Quận 1, TP.HCM")
  String address,

  @Schema(description = "Phí đấu nối (VNĐ)", example = "500000.00")
  @DecimalMin(value = "1000", inclusive = false, message = "Phí đấu nối phải lớn hơn 1000 VNĐ")
  BigDecimal connectionFee,

  @Schema(description = "Ghi chú bổ sung", example = "Đã bàn giao nghiệm thu hiện trường")
  String note,

  @Schema(description = "Ngày đăng ký quyết toán", example = "2023-10-27")
  LocalDate registrationAt
) {
}
