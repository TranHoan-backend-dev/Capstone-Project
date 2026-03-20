package com.capstone.construction.application.dto.request.settlement;

import com.capstone.common.enumerate.ProcessingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Request for creating/updating a settlement")
public record SettlementRequest(
    @Schema(description = "Job description/content", example = "Hoàn thành lắp đặt hệ thống cấp nước")
    @NotBlank(message = "Job content is required")
    String jobContent,

    @Schema(description = "Construction address", example = "123 Đường ABC")
    @NotBlank(message = "Address is required")
    String address,

    @Schema(description = "Connection fee", example = "500000.00")
    @NotNull(message = "Connection fee is required")
    @DecimalMin(value = "0.0", message = "Connection fee must be greater than or equal to 0")
    BigDecimal connectionFee,

    @Schema(description = "Optional note", example = "Đã bàn giao nghiệm thu")
    String note,

    @Schema(description = "Processing status", example = "APPROVED")
    @NotNull(message = "Status is required")
    ProcessingStatus status,

    @Schema(description = "Registration date", example = "2023-10-27")
    @NotNull(message = "Registration date is required")
    LocalDate registrationAt) {
}
