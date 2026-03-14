package com.capstone.customer.dto.request;

import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request DTO for creating or updating a Customer")
public record CustomerRequest(
  @Schema(description = "Customer name", example = "Trần Văn A")
  @NotBlank(message = SharedMessage.MES_05) String name,

  @Schema(description = "Customer email", example = "tranvana@example.com")
  @NotBlank(message = SharedMessage.MES_02)
  @Email(message = SharedMessage.MES_01) String email,

  @Schema(description = "Customer phone number", example = "0901234567")
  @NotBlank(message = SharedMessage.MES_03)
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @Schema(description = "Customer type", example = "INDIVIDUAL")
  @NotBlank(message = Message.ENT_07)
  String type,

  @Schema(description = "Is big customer flag", example = "false")
  @NotNull(message = "isBigCustomer flag is required")
  Boolean isBigCustomer,

  @Schema(description = "Usage target", example = "DOMESTIC")
  @NotNull(message = Message.ENT_16)
  UsageTarget usageTarget,

  @Schema(description = "Number of households", example = "1")
  @NotNull(message = SharedMessage.MES_11) Integer numberOfHouseholds,

  @Schema(description = "Household registration number", example = "123456")
  @NotNull(message = SharedMessage.MES_12) Integer householdRegistrationNumber,

  @Schema(description = "Protect environment fee", example = "1000")
  @NotNull(message = Message.ENT_30) Integer protectEnvironmentFee,

  @Schema(description = "Is free flag", example = "false")
  Boolean isFree,

  @Schema(description = "Is sale flag", example = "false")
  Boolean isSale,

  @Schema(description = "M3 sale value", example = "10")
  String m3Sale,

  @Schema(description = "Fix rate value", example = "5000")
  String fixRate,

  @Schema(description = "Installation fee", example = "1500000")
  Integer installationFee,

  @Schema(description = "Deduction period", example = "2023-12")
  String deductionPeriod,

  @Schema(description = "Monthly rent", example = "20000")
  Integer monthlyRent,

  @Schema(description = "Water meter type", example = "MECHANICAL")
  @NotBlank(message = Message.ENT_17) String waterMeterType,

  @Schema(description = "Citizen identification number", example = "012345678901")
  @NotBlank(message = SharedMessage.MES_10) String citizenIdentificationNumber,

  @Schema(description = "Citizen identification provided at", example = "Cục CSQLHC về TTXH")
  @NotBlank(message = SharedMessage.MES_16) String citizenIdentificationProvideAt,

  @Schema(description = "Payment method", example = "CASH")
  @NotBlank(message = Message.ENT_20) String paymentMethod,

  @Schema(description = "Bank account number", example = "123456789")
  @NotBlank(message = SharedMessage.MES_13) String bankAccountNumber,

  @Schema(description = "Bank account provider location", example = "Vietcombank")
  @NotBlank(message = SharedMessage.MES_17) String bankAccountProviderLocation,

  @Schema(description = "Bank account name", example = "TRAN VAN A")
  @NotBlank(message = Message.ENT_23) String bankAccountName,

  @Schema(description = "Budget relationship code", example = "BRC001")
  String budgetRelationshipCode,

  @Schema(description = "Passport code", example = "P001")
  String passportCode,

  @Schema(description = "Connection point", example = "CP001")
  String connectionPoint,

  @Schema(description = "Is active flag", example = "true")
  Boolean isActive,

  @Schema(description = "Cancel reason if inactive", example = "Moving house")
  String cancelReason,

  @Schema(description = "Installation form ID", example = "IF001")
  @NotBlank(message = Message.ENT_09) String installationFormId,

  @Schema(description = "Water price ID", example = "WP001")
  @NotBlank(message = Message.ENT_37) String waterPriceId,

  @Schema(description = "Water meter ID", example = "WM001")
  @NotBlank(message = "Water meter ID is required") String waterMeterId) {
}
