package com.capstone.construction.application.dto.request.receipt;

import java.time.LocalDate;

public record UpdateRequest(
  String formCode,
  String formNumber,
  String receiptNumber,
  String customerName,
  String address,
  LocalDate paymentDate,
  Boolean isPaid
) {}
