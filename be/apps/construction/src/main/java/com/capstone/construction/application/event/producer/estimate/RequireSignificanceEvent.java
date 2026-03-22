package com.capstone.construction.application.event.producer.estimate;

public record RequireSignificanceEvent(
  String estId,
  String surveyStaff,
  String plHead,
  String companyLeadership
) {
}
