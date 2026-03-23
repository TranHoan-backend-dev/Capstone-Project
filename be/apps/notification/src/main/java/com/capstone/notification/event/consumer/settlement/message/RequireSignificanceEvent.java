package com.capstone.notification.event.consumer.settlement.message;

public class RequireSignificanceEvent {
  public String pattern;
  public RequireSignificanceEventData data;

  public record RequireSignificanceEventData(
    String settlementId,
    String surveyStaff,
    String plHead,
    String companyLeadership,
    String constructionPresident
  ) {

  }
}
