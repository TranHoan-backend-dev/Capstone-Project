package com.capstone.auth.application.event.consumer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NotificationCreatedEvent(
    @JsonProperty("pattern") String pattern,
    @JsonProperty("data") NotificationData data) {

  @JsonIgnoreProperties(ignoreUnknown = true)
  public record NotificationData(
      @JsonProperty("notificationId") String notificationId,
      @JsonProperty("topics") List<String> topics) {
  }
}
