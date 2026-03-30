package com.capstone.auth.application.dto.response;

import lombok.Builder;

@Builder
public record NameAndIdResponse(
  String id,
  String name
) {
}
