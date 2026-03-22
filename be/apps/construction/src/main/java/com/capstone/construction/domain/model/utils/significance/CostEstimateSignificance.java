package com.capstone.construction.domain.model.utils.significance;

import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateSignificance implements Serializable {
  String surveyStaff = "";
  String planningTechnicalHead = "";
  String companyLeaderShip = "";

  public boolean isCostEstimateFullySigned() {
    return !surveyStaff.isBlank() && !planningTechnicalHead.isBlank() && !companyLeaderShip.isBlank();
  }
}
