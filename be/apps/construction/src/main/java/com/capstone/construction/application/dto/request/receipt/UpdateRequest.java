package com.capstone.construction.application.dto.request.receipt;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;

public record UpdateRequest(
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @NotEmpty(message = SharedMessage.MES_20)
  @NotBlank(message = SharedMessage.MES_20)
  String formNumber,
  String receiptNumber,
  String customerName,
  String address,
  LocalDate paymentDate,
  Boolean isPaid,

  @Schema(description = "Url chữ ký của thủ quỹ")
  String significanceOfTreasurer
) {
}
