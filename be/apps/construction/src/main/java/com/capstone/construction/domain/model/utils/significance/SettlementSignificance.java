package com.capstone.construction.domain.model.utils.significance;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SettlementSignificance implements Serializable {
  String president = "";
  String ptHead = "";
  String surveyStaff = "";
  String constructionPresident = "";

  @JsonIgnore
  public boolean isSettlementFullySigned() {
    return !surveyStaff.isBlank() && !president.isBlank() && !ptHead.isBlank() && !constructionPresident.isBlank();
  }
}
