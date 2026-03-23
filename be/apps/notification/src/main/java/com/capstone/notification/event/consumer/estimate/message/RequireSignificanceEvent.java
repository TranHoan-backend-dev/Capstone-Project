package com.capstone.notification.event.consumer.estimate.message;

public class RequireSignificanceEvent{
  public String pattern;
  public RequireSignificanceEventData data;

  public record RequireSignificanceEventData(
    String estId,
    String surveyStaff,
    String plHead,
    String companyLeadership
  ) {

  }
}
