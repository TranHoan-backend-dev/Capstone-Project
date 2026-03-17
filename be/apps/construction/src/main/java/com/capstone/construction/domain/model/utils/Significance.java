package com.capstone.construction.domain.model.utils;

import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Significance {
  String surveyStaff = "";
  String planningTechnicalHead = "";
  String companyLeaderShip = "";

  public boolean isCostEstimateFullySigned() {
    return !surveyStaff.isBlank() && !planningTechnicalHead.isBlank() && !companyLeaderShip.isBlank();
  }
}
