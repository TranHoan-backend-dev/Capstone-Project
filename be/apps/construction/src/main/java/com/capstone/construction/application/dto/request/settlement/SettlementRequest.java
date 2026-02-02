package com.capstone.construction.application.dto.request.settlement;

import com.capstone.construction.domain.model.utils.ProcessingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Request for creating/updating a settlement")
public record SettlementRequest(
        @Schema(description = "Job description/content", example = "Hoàn thành lắp đặt hệ thống cấp nước") @NotBlank(message = "Job content is required") String jobContent,

        @Schema(description = "Construction address", example = "123 Đường ABC") @NotBlank(message = "Address is required") String address,

        @Schema(description = "Connection fee", example = "500000.00") @NotNull(message = "Connection fee is required") BigDecimal connectionFee,

        @Schema(description = "Optional note", example = "Đã bàn giao nghiệm thu") @NotBlank(message = "Note is required") // Entity
                                                                                                                           // has
                                                                                                                           // nullable=false
                                                                                                                           // for
                                                                                                                           // note
                                                                                                                           // too
        String note,

        @Schema(description = "Processing status", example = "APPROVED") @NotNull(message = "Status is required") ProcessingStatus status,

        @Schema(description = "Registration date", example = "2023-10-27") @NotNull(message = "Registration date is required") LocalDate registrationAt) {
}
