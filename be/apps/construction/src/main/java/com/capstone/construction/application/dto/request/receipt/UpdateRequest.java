package com.capstone.construction.application.dto.request.receipt;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateRequest(
  @NotNull(message = SharedMessage.MES_21)
  Long formCode,

  @NotNull(message = SharedMessage.MES_20)
  Long formNumber,
  String receiptNumber,
  String customerName,
  String address,
  LocalDate paymentDate,
  Boolean isPaid,

  @Schema(description = "Url chữ ký của thủ quỹ")
  String significanceOfTreasurer
) {
}
