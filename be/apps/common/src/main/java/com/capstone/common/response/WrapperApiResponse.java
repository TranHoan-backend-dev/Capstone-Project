package com.capstone.common.response;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WrapperApiResponse(
  int status,
  String message,
  Object data,
  OffsetDateTime timestamp) {
}
