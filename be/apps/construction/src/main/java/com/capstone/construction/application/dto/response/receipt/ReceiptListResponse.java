package com.capstone.construction.application.dto.response.receipt;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReceiptListResponse(
    String formCode,
    String formNumber,
    String receiptNumber,
    String customerName,
    String address,
    LocalDate paymentDate,
    Boolean isPaid,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}