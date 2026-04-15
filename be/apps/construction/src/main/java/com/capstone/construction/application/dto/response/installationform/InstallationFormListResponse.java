package com.capstone.construction.application.dto.response.installationform;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.Representative;
import java.util.List;

public record InstallationFormListResponse(
  String constructionRequestId,
  String formCode,
  String formNumber,
  String customerName,
  String address,
  String phoneNumber,
  String scheduleSurveyAt,
  String registrationAt,
  String handoverBy,
  String handoverByFullName,
  String creator,
  String creatorFullName,
  String constructedBy,
  String constructedByFullName,
  FormProcessingStatus status,
  String overallWaterMeterId,
  String taxCode,
  String bankAccountNumber,
  String bankAccountProviderLocation,
  String citizenIdentificationNumber,
  String citizenIdentificationProvideDate,
  String citizenIdentificationProvideLocation,
  Integer numberOfHousehold,
  Integer householdRegistrationNumber,
  UsageTarget usageTarget,
  CustomerType customerType,
  List<Representative> representatives,
  String createdAt
) {
}
