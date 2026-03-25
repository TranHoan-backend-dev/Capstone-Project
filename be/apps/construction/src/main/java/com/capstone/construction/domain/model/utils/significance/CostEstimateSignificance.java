package com.capstone.construction.domain.model.utils.significance;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateSignificance implements Serializable {
  String surveyStaff = "";
  String planningTechnicalHead = "";
  String companyLeaderShip = "";

  @JsonIgnore
  public boolean isCostEstimateFullySigned() {
    return !surveyStaff.isBlank() && !planningTechnicalHead.isBlank() && !companyLeaderShip.isBlank();
  }
}
