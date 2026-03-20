package com.capstone.construction.domain.model.utils;

import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SettlementSignificance implements Serializable {
  String president = "";
  String ptHead = "";
  String surveyStaff = "";
  String constructionPresident = "";

  public boolean isSettlementFullySigned() {
    return !surveyStaff.isBlank() && !president.isBlank() && !ptHead.isBlank() && !constructionPresident.isBlank();
  }
}
