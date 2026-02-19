package com.capstone.auth.application.business.dto;

import java.time.LocalDate;

public record ProfileDTO(
  String id,
  String fullname,
  String avatarUrl,
  String address,
  String phoneNumber,
  Boolean gender,
  LocalDate birthday) {
}
