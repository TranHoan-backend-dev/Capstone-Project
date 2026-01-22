package com.capstone.auth.application.dto.response;

public record ProfileResponse(
  String id,
  String fullname,
  String avatarUrl,
  String address,
  String phoneNumber,
  Boolean gender,
  String birthday
) {
}
