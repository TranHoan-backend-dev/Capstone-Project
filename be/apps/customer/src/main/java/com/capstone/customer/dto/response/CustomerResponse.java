package com.capstone.customer.dto.response;

import com.capstone.common.enumerate.UsageTarget;

import java.time.LocalDateTime;

public record CustomerResponse(
  String customerId,
  String name,
  String email,
  String phoneNumber,
  String type,
  Boolean isBigCustomer,
  UsageTarget usageTarget,
  Integer numberOfHouseholds,
  Integer householdRegistrationNumber,
  Integer protectEnvironmentFee,
  Boolean isFree,
  Boolean isSale,
  String m3Sale,
  String fixRate,
  Integer installationFee,
  String deductionPeriod,
  Integer monthlyRent,
  String waterMeterType,
  String citizenIdentificationNumber,
  String citizenIdentificationProvideAt,
  String paymentMethod,
  String bankAccountNumber,
  String bankAccountProviderLocation,
  String bankAccountName,
  String budgetRelationshipCode,
  String passportCode,
  String connectionPoint,
  Boolean isActive,
  String cancelReason,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,
  String installationFormId,
  String waterPriceId,
  WaterPriceInfoResponse waterPrice,
  String waterMeterId,
  WaterMeterInfoResponse waterMeter,
  String address,
  String roadmapId
) {
}
