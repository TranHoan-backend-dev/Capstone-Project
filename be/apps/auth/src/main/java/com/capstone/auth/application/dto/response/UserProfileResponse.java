package com.capstone.auth.application.dto.response;

// TODO: tra ve them ca cac endpoint socket ma role nay lang nghe nua
public record UserProfileResponse(
  String fullname,
  String avatarUrl,
  String address,
  String phoneNumber,
  String gender,
  String birthday,
  String role,
  String username,
  String email,
  String id,
  String significanceUrl,
  String departmentName
) {
}
