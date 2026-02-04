package com.capstone.construction.application.dto.response.estimate;

import com.capstone.construction.domain.enumerate.ProcessingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Response representing a cost estimate")
public record CostEstimateResponse(
        @Schema(description = "Unique identifier of the estimation", example = "uuid-123") String estimationId,

        @Schema(description = "Customer name") String customerName,

        @Schema(description = "Installation address") String address,

        @Schema(description = "Optional note") String note,

        @Schema(description = "Contract fee") Integer contractFee,

        @Schema(description = "Survey fee") Integer surveyFee,

        @Schema(description = "Survey effort (man-days)") Integer surveyEffort,

        @Schema(description = "Installation fee") Integer installationFee,

        @Schema(description = "Labor coefficient (%)") Integer laborCoefficient,

        @Schema(description = "General cost coefficient (%)") Integer generalCostCoefficient,

        @Schema(description = "Precalculated tax coefficient (%)") Integer precalculatedTaxCoefficient,

        @Schema(description = "Construction machinery coefficient (%)") Integer constructionMachineryCoefficient,

        @Schema(description = "VAT coefficient (%)") Integer vatCoefficient,

        @Schema(description = "Design coefficient (%)") Integer designCoefficient,

        @Schema(description = "Design fee") Integer designFee,

        @Schema(description = "Design image URL") String designImageUrl,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt,

        @Schema(description = "Update timestamp") LocalDateTime updatedAt,

        @Schema(description = "Processing status") ProcessingStatus status,

        @Schema(description = "Registration date") LocalDate registrationAt,

        @Schema(description = "Created by employee ID") String createBy,

        @Schema(description = "Water meter serial number") String waterMeterSerial,

        @Schema(description = "Overall water meter ID") String overallWaterMeterId,

        @Schema(description = "Installation form ID") String installationFormId) {
}
