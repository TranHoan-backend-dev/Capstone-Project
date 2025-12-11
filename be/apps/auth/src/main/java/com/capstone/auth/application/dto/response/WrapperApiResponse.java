package com.capstone.auth.application.dto.response;

import java.time.LocalDateTime;

public record WrapperApiResponse(
  int status,
  String message,
  Object data,
  LocalDateTime timestamp
) {
}

