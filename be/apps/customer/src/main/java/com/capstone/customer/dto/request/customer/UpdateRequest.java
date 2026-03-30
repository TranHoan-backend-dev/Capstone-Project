package com.capstone.customer.dto.request.customer;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "")
public record UpdateRequest(
  @Schema(description = "", example = "Trần Văn A")
  String name,

  @Schema(description = "", example = "tranvana@example.com")
  @Email(message = SharedMessage.MES_01) String email,

  @Schema(description = "", example = "0901234567")
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @Schema(description = "", example = "")
  CustomerType type,

  @Schema(description = "", example = "false")
  Boolean isBigCustomer,

  @Schema(description = "", example = "DOMESTIC")
  UsageTarget usageTarget,

  @Schema(description = "Number of households", example = "1")
  Integer numberOfHouseholds,

  @Schema(description = "Household registration number", example = "123456")
  Integer householdRegistrationNumber,

  @Schema(description = "Protect environment fee", example = "1000")
  Integer protectEnvironmentFee,

  @Schema(description = "", example = "false")
  Boolean isFree,

  @Schema(description = "", example = "false")
  Boolean isSale,

  @Schema(description = "", example = "10")
  String m3Sale,

  @Schema(description = "", example = "5000")
  String fixRate,

  @Schema(description = "", example = "1500000")
  Integer installationFee,

  @Schema(description = "", example = "2023-12")
  String deductionPeriod,

  @Schema(description = "", example = "20000")
  Integer monthlyRent,

  @Schema(description = "", example = "MECHANICAL")
  String waterMeterType,

  @Schema(description = "", example = "012345678901")
  String citizenIdentificationNumber,

  @Schema(description = "", example = "Cục CSQLHC về TTXH")
  String citizenIdentificationProvideAt,

  @Schema(description = "", example = "CASH")
  String paymentMethod,

  @Schema(description = "", example = "123456789")
  String bankAccountNumber,

  @Schema(description = "", example = "Vietcombank")
  String bankAccountProviderLocation,

  @Schema(description = "", example = "TRAN VAN A")
  String bankAccountName,

  @Schema(description = "", example = "BRC001")
  String budgetRelationshipCode,

  @Schema(description = "", example = "P001")
  String passportCode,

  @Schema(description = "", example = "CP001")
  String connectionPoint,

  @Schema(description = "", example = "true")
  Boolean isActive,

  @Schema(description = "", example = "Moving house")
  String cancelReason,

  @Schema(description = "", example = "IF001")
  String formNumber,

  @Schema(description = "", example = "IF001")
  String formCode,

  @Schema(description = "", example = "WP001")
  String waterPriceId,

  @Schema(description = "", example = "WM001")
  String waterMeterId,

  @Schema(description = "Id cua hop dong")
  String contractId
) {
}
