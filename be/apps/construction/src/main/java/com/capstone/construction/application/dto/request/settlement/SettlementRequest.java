package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Yêu cầu tạo hoặc cập nhật thông tin quyết toán công trình")
public record SettlementRequest(
    @NotBlank
    @NotEmpty
    String formCode,

    @NotBlank
    @NotEmpty
    String formNumber,

    @Schema(description = "Nội dung công việc", example = "Lắp đặt hệ thống cấp nước D110")
    @NotBlank(message = "Nội dung công việc là bắt buộc")
    String jobContent,

    @Schema(description = "Địa chỉ thi công công trình", example = "123 Đường ABC, Quận 1, TP.HCM")
    @NotBlank(message = "Địa chỉ là bắt buộc")
    String address,

    @Schema(description = "Phí đấu nối (VNĐ)", example = "500000.00")
    @NotNull(message = "Phí đấu nối là bắt buộc")
    @DecimalMin(value = "0.0", message = "Phí đấu nối phải lớn hơn hoặc bằng 0")
    BigDecimal connectionFee,

    @Schema(description = "Ghi chú bổ sung", example = "Đã bàn giao nghiệm thu hiện trường")
    String note,

    @Schema(description = "Ngày đăng ký quyết toán", example = "2023-10-27")
    @NotNull(message = "Ngày đăng ký là bắt buộc")
    LocalDate registrationAt
) {}
