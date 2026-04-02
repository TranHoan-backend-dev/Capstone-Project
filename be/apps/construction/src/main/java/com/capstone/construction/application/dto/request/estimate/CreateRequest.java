package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateRequest(
  @NotBlank(message = SharedMessage.MES_05)
  @NotEmpty(message = SharedMessage.MES_05)
  String customerName,

  @NotBlank(message = SharedMessage.MES_06)
  @NotEmpty(message = SharedMessage.MES_06)
  String address,

  @NotNull(message = Message.PT_39)
  LocalDateTime registrationAt,

  @NotBlank(message = Message.PT_26)
  @NotEmpty(message = Message.PT_26)
  String createBy,

  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  String overallWaterMeterId
) {
}
