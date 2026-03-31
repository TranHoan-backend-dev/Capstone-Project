package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Yêu cầu cập nhật trạng thái quyết toán công trình")
public record UpdateSettlementStatusRequest(
    @Schema(description = "Trạng thái mới", example = "APPROVED")
    @NotNull(message = "Trạng thái là bắt buộc")
    @NotBlank(message = "Trạng thái không được để trống")
    String status
) {}
