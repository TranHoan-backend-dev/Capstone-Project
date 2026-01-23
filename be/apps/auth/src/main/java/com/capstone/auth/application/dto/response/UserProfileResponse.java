package com.capstone.auth.application.dto.response;

public record UserProfileResponse(
  String fullname,
  String avatarUrl,
  String address,
  String phoneNumber,
  String gender,
  String birthday,
  String role,
  String username,
  String email
) {
}
