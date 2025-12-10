package com.capstone.notification.dto.response;

import java.time.LocalDateTime;

public record WrapperApiResponse(
  int status,
  String message,
  Object data,
  LocalDateTime timestamp
) {
}

