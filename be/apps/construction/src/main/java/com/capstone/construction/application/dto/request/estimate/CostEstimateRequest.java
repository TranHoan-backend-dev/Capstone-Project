package com.capstone.construction.application.dto.request.estimate;

import com.capstone.construction.domain.enumerate.ProcessingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(description = "Request for creating/updating a cost estimate")
public record CostEstimateRequest(
        @Schema(description = "Customer name", example = "Trần Văn A") @NotBlank(message = "Customer name is required") String customerName,

        @Schema(description = "Installation address", example = "123 Đường ABC, Phường X, Quận Y") @NotBlank(message = "Address is required") String address,

        @Schema(description = "Optional note", example = "Khách hàng yêu cầu lắp nhanh") String note,

        @Schema(description = "Contract fee", example = "2000000") @NotNull(message = "Contract fee is required") Integer contractFee,

        @Schema(description = "Survey fee", example = "100000") @NotNull(message = "Survey fee is required") Integer surveyFee,

        @Schema(description = "Survey effort (man-days)", example = "1") @NotNull(message = "Survey effort is required") Integer surveyEffort,

        @Schema(description = "Installation fee", example = "1500000") @NotNull(message = "Installation fee is required") Integer installationFee,

        @Schema(description = "Labor coefficient (%)", example = "20") @NotNull(message = "Labor coefficient is required") Integer laborCoefficient,

        @Schema(description = "General cost coefficient (%)", example = "5") @NotNull(message = "General cost coefficient is required") Integer generalCostCoefficient,

        @Schema(description = "Precalculated tax coefficient (%)", example = "10") @NotNull(message = "Precalculated tax coefficient is required") Integer precalculatedTaxCoefficient,

        @Schema(description = "Construction machinery coefficient (%)", example = "0") @NotNull(message = "Construction machinery coefficient is required") Integer constructionMachineryCoefficient,

        @Schema(description = "VAT coefficient (%)", example = "10") @NotNull(message = "VAT coefficient is required") Integer vatCoefficient,

        @Schema(description = "Design coefficient (%)", example = "2") @NotNull(message = "Design coefficient is required") Integer designCoefficient,

        @Schema(description = "Design fee", example = "500000") @NotNull(message = "Design fee is required") Integer designFee,

        @Schema(description = "Design image URL", example = "http://storage.com/design.png") @NotBlank(message = "Design image URL is required") String designImageUrl,

        @Schema(description = "Processing status", example = "PROCESSING") @NotNull(message = "Status is required") ProcessingStatus status,

        @Schema(description = "Registration date", example = "2023-10-27") @NotNull(message = "Registration date is required") LocalDate registrationAt,

        @Schema(description = "Employee ID who created this estimate", example = "user-123") @NotBlank(message = "Created by is required") String createBy,

        @Schema(description = "Water meter serial number", example = "SN12345678") @NotBlank(message = "Water meter serial is required") String waterMeterSerial,

        @Schema(description = "Overall water meter ID", example = "OM-001") @NotBlank(message = "Overall water meter ID is required") String overallWaterMeterId,

        @Schema(description = "Installation form ID", example = "form-uuid-123") @NotBlank(message = "Installation form ID is required") String installationFormId) {
}
