package com.capstone.construction.application.dto.request.installationform;

import com.capstone.construction.domain.model.utils.Representative;
import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record NewOrderRequest(
    @Schema(description = "Unique form number identifying the request", example = "LF-2024-002")
    @NotBlank(message = Constant.PT_44) String formNumber,

    @Schema(description = "Full name of the customer", example = "Trần Hoàng")
    @NotBlank(message = Constant.PT_27) String customerName,

    @Schema(description = "Service address", example = "123 Main St, District 1, HCM")
    @NotBlank(message = Constant.PT_12) String address,

    @Schema(description = "Citizen identification number (CCCD)", example = "012345678901")
    @NotBlank(message = Constant.PT_48) String citizenIdentificationNumber,

    @Schema(description = "CCCD provide date", example = "2020-01-01")
    @NotBlank(message = Constant.PT_49) String citizenIdentificationProvideDate,

    @Schema(description = "CCCD provide location", example = "Cục Cảnh sát QLHC về TTXH")
    @NotBlank(message = Constant.PT_50) String citizenIdentificationProvideLocation,

    @Schema(description = "Customer phone number", example = "0901234567")
    @NotBlank(message = Constant.PT_15)
    @Pattern(regexp = Constant.PHONE_PATTERN, message = Constant.PT_14) String phoneNumber,

    @Schema(description = "Tax identification code", example = "8001234567")
    @NotBlank(message = Constant.PT_51) String taxCode,

    @Schema(description = "Bank account number", example = "123456789")
    @NotBlank(message = Constant.PT_52) String bankAccountNumber,

    @Schema(description = "Bank provided location", example = "Vietcombank HCM")
    @NotBlank(message = Constant.PT_53) String bankAccountProviderLocation,

    @Schema(description = "Usage target (e.g. INDIVIDUAL, BUSINESS)", example = "INDIVIDUAL")
    @NotBlank(message = Constant.PT_54) String usageTarget,

    @Schema(description = "Form received timestamp (ISO format)", example = "2024-02-01T08:00:00")
    @NotBlank(message = Constant.PT_55)
    @NotEmpty(message = Constant.PT_55) String receivedFormAt,

    @Schema(description = "Scheduled survey timestamp (ISO format)", example = "2024-02-05T09:00:00")
    @NotBlank(message = Constant.PT_78)
    @NotEmpty(message = Constant.PT_78) String scheduleSurveyAt,

    @Schema(description = "Number of households using the meter", example = "1")
    @NotBlank(message = Constant.PT_56) Integer numberOfHousehold,

    @Schema(description = "Household registration number", example = "1")
    @NotBlank(message = Constant.PT_57) Integer householdRegistrationNumber,

    @Schema(description = "List of customer representatives") List<Representative> representative,

    @Schema(description = "ID of the water supply network", example = "net-001")
    @NotBlank(message = Constant.PT_59)
    @NotEmpty(message = Constant.PT_59) String networkId,

    @Schema(description = "ID of the staff who created this form", example = "emp-001")
    @NotBlank(message = Constant.PT_61) String createdBy,

    @Schema(description = "ID of the overall water meter", example = "owm-001")
    @NotBlank(message = Constant.PT_62) String overallWaterMeterId) {
}
