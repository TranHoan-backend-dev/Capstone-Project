package com.capstone.auth.dto.response;

import java.time.LocalDateTime;

public record WrapperApiResponse(
  int status,
  String message,
  Object data,
  LocalDateTime timestamp
) {
}

