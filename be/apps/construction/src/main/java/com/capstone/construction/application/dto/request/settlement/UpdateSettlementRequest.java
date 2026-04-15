package com.capstone.construction.application.dto.request.settlement;

import com.capstone.common.request.BaseMaterial;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Schema(description = "Yêu cầu cập nhật thông tin quyết toán công trình")
public record UpdateSettlementRequest(
  @Schema(description = "ID của bản quyết toán", example = "SETTLE-2024-001")
  String settlementId,

  @Schema(description = "Nội dung công việc", example = "Lắp đặt hệ thống cấp nước D110")
  String jobContent,

  @Schema(description = "Tên khách hàng", example = "Nguyễn Văn A")
  String customerName,

  @Schema(description = "Địa chỉ thi công công trình", example = "123 Đường ABC, Quận 1, TP.HCM")
  String address,

  @Schema(description = "Phí đấu nối (VNĐ)", example = "500000.00")
  @DecimalMin(value = "1000", inclusive = false, message = "Phí đấu nối phải lớn hơn 1000 VNĐ")
  BigDecimal connectionFee,

  @Schema(description = "Ghi chú bổ sung", example = "Đã bàn giao nghiệm thu hiện trường")
  String note,

  @Schema(description = "Ngày đăng ký quyết toán", example = "2023-10-27")
  LocalDate registrationAt,

  List<BaseMaterial> materials
) {
}
