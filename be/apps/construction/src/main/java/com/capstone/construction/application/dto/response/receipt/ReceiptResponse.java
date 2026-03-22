package com.capstone.construction.application.dto.response.receipt;

import com.capstone.construction.domain.model.utils.significance.ReceiptSignificance;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReceiptResponse(
  String formCode,
  String formNumber,
  String receiptNumber,
  String customerName,
  String address,
  LocalDate paymentDate,
  Boolean isPaid,
  String paymentReason,
  String totalMoneyInDigits,
  String totalMoneyInCharacters,
  String attach,
  ReceiptSignificance significance,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {
}
