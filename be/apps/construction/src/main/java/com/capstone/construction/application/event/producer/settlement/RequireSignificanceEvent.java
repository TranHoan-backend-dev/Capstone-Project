package com.capstone.construction.application.event.producer.settlement;

public record RequireSignificanceEvent(
  String settlementId,
  String surveyStaff,
  String plHead,
  String companyLeadership,
  String constructionPresident
) {
}
