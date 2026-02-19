package com.capstone.device.application.dto.response;

public record ParameterResponse(
  String id,
  String name,
  String value,
  String creatorName,
  String updatorName,
  String createAt,
  String updateAt
) {
}
