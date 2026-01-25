package com.capstone.auth.application.business.dto;

public record ProfileResponse(
  String id,
  String fullname,
  String avatarUrl,
  String address,
  String phoneNumber,
  String gender,
  String birthday
) {
}
