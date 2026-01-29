package com.capstone.construction.application.dto.request;

import com.capstone.construction.domain.model.utils.Representative;
import com.capstone.construction.infrastructure.config.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record NewOrderRequest(
  @NotBlank(message = Constant.PT_44)
  String formNumber,

  @NotBlank(message = Constant.PT_27)
  String customerName,

  @NotBlank(message = Constant.PT_12)
  String address,

  @NotBlank(message = Constant.PT_48)
  String citizenIdentificationNumber,

  @NotBlank(message = Constant.PT_49)
  String citizenIdentificationProvideDate,

  @NotBlank(message = Constant.PT_50)
  String citizenIdentificationProvideLocation,

  @NotBlank(message = Constant.PT_15)
  @Pattern(regexp = Constant.PHONE_PATTERN, message = Constant.PT_14)
  String phoneNumber,

  @NotBlank(message = Constant.PT_51)
  String taxCode,

  @NotBlank(message = Constant.PT_52)
  String bankAccountNumber,

  @NotBlank(message = Constant.PT_53)
  String bankAccountProviderLocation,

  @NotBlank(message = Constant.PT_54)
  String usageTarget,

  @NotBlank(message = Constant.PT_55)
  @NotEmpty(message = Constant.PT_55)
  String receivedFormAt,

  @NotBlank(message = Constant.PT_78)
  @NotEmpty(message = Constant.PT_78)
  String scheduleSurveyAt,

  @NotBlank(message = Constant.PT_56)
  Integer numberOfHousehold,

  @NotBlank(message =  Constant.PT_57)
  Integer householdRegistrationNumber,
  List<Representative> representative,

  @NotBlank(message = Constant.PT_59)
  @NotEmpty(message = Constant.PT_59)
  String networkId,

  @NotBlank(message = Constant.PT_61)
  String createdBy,

  @NotBlank(message = Constant.PT_62)
  String overallWaterMeterId
) {
}
