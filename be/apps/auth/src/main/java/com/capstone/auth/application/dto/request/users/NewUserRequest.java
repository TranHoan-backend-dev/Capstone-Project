package com.capstone.auth.application.dto.request.users;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record NewUserRequest(
  @NotBlank
  @NotEmpty
  String username,

  @NotBlank
  @NotEmpty
  @Pattern(regexp = SharedConstant.PASSWORD_PATTERN, message = Message.PT_01)
  String password,

  @NotBlank
  @NotEmpty
  String fullName,

  @NotBlank
  @NotEmpty
  @Email(message = SharedMessage.MES_01)
  String email,

  @NotBlank
  @NotEmpty
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @NotBlank
  @NotEmpty
  String role,

  List<String> jobIds,

  @NotBlank
  @NotEmpty
  String departmentId,

  @NotBlank
  @NotEmpty
  String waterSupplyNetworkId
) {
}
