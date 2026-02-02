package com.capstone.customer.dto.response;

import com.capstone.customer.model.UsageTarget;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

/**
 * Response DTO for Customer information.
 */
@Schema(description = "Response DTO for Customer information")
public record CustomerResponse(
        @Schema(description = "Unique identifier of the customer") String customerId,

        @Schema(description = "Customer name") String name,

        @Schema(description = "Customer email") String email,

        @Schema(description = "Customer phone number") String phoneNumber,

        @Schema(description = "Customer type") String type,

        @Schema(description = "Is big customer flag") Boolean isBigCustomer,

        @Schema(description = "Usage target") UsageTarget usageTarget,

        @Schema(description = "Number of households") Integer numberOfHouseholds,

        @Schema(description = "Household registration number") Integer householdRegistrationNumber,

        @Schema(description = "Protect environment fee") Integer protectEnvironmentFee,

        @Schema(description = "Is free flag") Boolean isFree,

        @Schema(description = "Is sale flag") Boolean isSale,

        @Schema(description = "M3 sale value") String m3Sale,

        @Schema(description = "Fix rate value") String fixRate,

        @Schema(description = "Installation fee") Integer installationFee,

        @Schema(description = "Deduction period") String deductionPeriod,

        @Schema(description = "Monthly rent") Integer monthlyRent,

        @Schema(description = "Water meter type") String waterMeterType,

        @Schema(description = "Citizen identification number") String citizenIdentificationNumber,

        @Schema(description = "Citizen identification provided at") String citizenIdentificationProvideAt,

        @Schema(description = "Payment method") String paymentMethod,

        @Schema(description = "Bank account number") String bankAccountNumber,

        @Schema(description = "Bank account provider location") String bankAccountProviderLocation,

        @Schema(description = "Bank account name") String bankAccountName,

        @Schema(description = "Budget relationship code") String budgetRelationshipCode,

        @Schema(description = "Passport code") String passportCode,

        @Schema(description = "Connection point") String connectionPoint,

        @Schema(description = "Is active flag") Boolean isActive,

        @Schema(description = "Cancel reason if inactive") String cancelReason,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt,

        @Schema(description = "Last update timestamp") LocalDateTime updatedAt,

        @Schema(description = "Installation form ID") String installationFormId,

        @Schema(description = "Water price ID") String waterPriceId,

        @Schema(description = "Water meter ID") String waterMeterId) {
}
