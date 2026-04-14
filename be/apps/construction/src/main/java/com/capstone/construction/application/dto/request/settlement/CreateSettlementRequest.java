package com.capstone.construction.application.dto.request.settlement;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Yêu cầu tạo thông tin quyết toán công trình")
public record CreateSettlementRequest(
  @NotBlank(message = "Mã quyết toán không được để trống")
  @NotEmpty(message = "Mã quyết toán không được để trống")
  String settlementId,

  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  @Schema(description = "Nội dung công việc", example = "Lắp đặt hệ thống cấp nước D110")
  @NotBlank(message = "Nội dung công việc là bắt buộc")
  @NotEmpty(message = "Nội dung công việc là bắt buộc")
  String jobContent,

  @Schema(description = "Tên khách hàng", example = "Nguyễn Văn A")
  @NotBlank(message = "Tên khách hàng không được để trống")
  @NotEmpty(message = "Tên khách hàng không được để trống")
  String customerName,

  @Schema(description = "Địa chỉ thi công công trình", example = "123 Đường ABC, Quận 1, TP.HCM")
  @NotBlank(message = "Địa chỉ là bắt buộc")
  @NotEmpty(message = "Địa chỉ là bắt buộc")
  String address,

  @Schema(description = "Phí đấu nối (VNĐ)", example = "500000.00")
  @NotNull(message = "Phí đấu nối là bắt buộc")
  @DecimalMin(value = "1000", inclusive = false, message = "Phí đấu nối phải lớn hơn 1000 VNĐ")
  BigDecimal connectionFee,

  @Schema(description = "Ghi chú bổ sung", example = "Đã bàn giao nghiệm thu hiện trường")
  String note,

  @Schema(description = "Ngày đăng ký quyết toán", example = "2023-10-27")
  @NotNull(message = "Ngày đăng ký là bắt buộc")
  LocalDate registrationAt
) {
}
