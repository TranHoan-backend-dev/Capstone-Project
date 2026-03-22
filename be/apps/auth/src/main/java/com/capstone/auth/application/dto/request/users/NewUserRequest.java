package com.capstone.auth.application.dto.request.users;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.validation.constraints.*;

import java.util.List;

public record NewUserRequest(
  @NotBlank(message = SharedMessage.MES_18)
  @NotEmpty(message = SharedMessage.MES_18)
  String username,

  @NotBlank(message = Message.PT_16)
  @NotEmpty(message = Message.PT_16)
  @Pattern(regexp = SharedConstant.PASSWORD_PATTERN, message = Message.PT_01)
  String password,

  @NotBlank
  @NotEmpty
  String firstName,

  @NotBlank
  @NotEmpty
  String lastName,

  @NotBlank(message = SharedMessage.MES_02)
  @NotEmpty(message = SharedMessage.MES_02)
  @Email(message = SharedMessage.MES_01)
  String email,

  @NotBlank
  @NotEmpty
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @NotBlank(message = Message.PT_13)
  @NotEmpty(message = Message.PT_13)
  String role,

  @NotNull(message = Message.PT_12)
  List<String> jobIds,

  @NotBlank(message = Message.PT_11)
  @NotEmpty(message = Message.PT_11)
  String departmentId,

  @NotBlank(message = Message.PT_10)
  @NotEmpty(message = Message.PT_10)
  String waterSupplyNetworkId
) {
}
