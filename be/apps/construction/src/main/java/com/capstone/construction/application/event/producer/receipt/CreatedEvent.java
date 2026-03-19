package com.capstone.construction.application.event.producer.receipt;

import java.time.LocalDate;

public record CreatedEvent(
  String formCode,
  String formNumber,
  String receiptNumber,
  String customerName,
  String address,
  LocalDate paymentDate,
  Boolean isPaid
) {}
