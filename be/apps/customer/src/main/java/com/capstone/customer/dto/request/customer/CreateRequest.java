package com.capstone.customer.dto.request.customer;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "")
public record CreateRequest(
  @Schema(description = "", example = "Trần Văn A")
  @NotBlank(message = SharedMessage.MES_05)
  @NotEmpty(message = SharedMessage.MES_05)
  String name,

  @Schema(description = "", example = "tranvana@example.com")
  @NotBlank(message = SharedMessage.MES_02)
  @NotEmpty(message = SharedMessage.MES_02)
  @Email(message = SharedMessage.MES_01) String email,

  @Schema(description = "", example = "0901234567")
  @NotBlank(message = SharedMessage.MES_03)
  @NotEmpty(message = SharedMessage.MES_03)
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @Schema(description = "", example = "")
  @NotNull(message = Message.ENT_03)
  CustomerType type,

  @Schema(description = "", example = "false")
  @NotNull(message = Message.ENT_25)
  Boolean isBigCustomer,

  @Schema(description = "", example = "DOMESTIC")
  @NotNull(message = Message.ENT_06)
  UsageTarget usageTarget,

  @Schema(description = "Number of households", example = "1")
  @NotNull(message = SharedMessage.MES_11) Integer numberOfHouseholds,

  @Schema(description = "Household registration number", example = "123456")
  @NotNull(message = SharedMessage.MES_12) Integer householdRegistrationNumber,

  @Schema(description = "Protect environment fee", example = "1000")
  @NotNull(message = Message.ENT_14) Integer protectEnvironmentFee,

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

  @Schema(description = "", example = "2023-12")
  @NotEmpty
  @NotBlank
  String address,

  @Schema(description = "", example = "20000")
  Integer monthlyRent,

  @Schema(description = "", example = "MECHANICAL")
  @NotBlank(message = Message.ENT_07)
  @NotEmpty(message = Message.ENT_07)
  String waterMeterType,

  @Schema(description = "", example = "012345678901")
  @NotBlank(message = SharedMessage.MES_10)
  @NotEmpty(message = SharedMessage.MES_10)
  String citizenIdentificationNumber,

  @Schema(description = "", example = "Cục CSQLHC về TTXH")
  @NotBlank(message = SharedMessage.MES_16)
  @NotEmpty(message = SharedMessage.MES_16)
  String citizenIdentificationProvideAt,

  @Schema(description = "", example = "CASH")
  @NotBlank(message = Message.ENT_08)
  @NotEmpty(message = Message.ENT_08)
  String paymentMethod,

  @Schema(description = "", example = "123456789")
  @NotBlank(message = SharedMessage.MES_13)
  @NotEmpty(message = SharedMessage.MES_13)
  String bankAccountNumber,

  @Schema(description = "", example = "Vietcombank")
  @NotBlank(message = SharedMessage.MES_17)
  @NotEmpty(message = SharedMessage.MES_17)
  String bankAccountProviderLocation,

  @Schema(description = "", example = "TRAN VAN A")
  @NotBlank(message = Message.ENT_09)
  @NotEmpty(message = Message.ENT_09)
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
  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  @Schema(description = "", example = "IF001")
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @Schema(description = "", example = "WP001")
  @NotBlank(message = Message.ENT_18)
  @NotEmpty(message = Message.ENT_18)
  String waterPriceId,

  @Schema(description = "", example = "R001")
  @NotBlank(message = "roadmapId is required")
  String roadmapId,

  @Schema(description = "", example = "WM001")
  @NotBlank(message = Message.ENT_26)
  @NotEmpty(message = Message.ENT_26)
  String waterMeterId,

  @Schema(description = "Ma hop dong")
  @NotBlank
  @NotEmpty
  String contractId
) {
}
