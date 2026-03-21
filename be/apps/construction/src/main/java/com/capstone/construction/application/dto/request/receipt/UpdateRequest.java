package com.capstone.construction.application.dto.request.receipt;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record UpdateRequest(
  String formCode,
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
