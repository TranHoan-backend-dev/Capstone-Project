package com.capstone.user.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public record WrapperApiResponse(
  int status,
  String message,
  Object data,
  LocalDateTime timestamp
) {
}

