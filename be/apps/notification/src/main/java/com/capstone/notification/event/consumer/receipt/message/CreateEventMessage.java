package com.capstone.notification.event.consumer.receipt.message;

import java.time.LocalDate;

public record CreateEventMessage(
  String pattern,
  ReceiptData data
) {
  public record ReceiptData(
    String formCode,
    String formNumber,
    String receiptNumber,
    String customerName,
    String address,
    LocalDate paymentDate,
    Boolean isPaid
  ) {
  }
}
