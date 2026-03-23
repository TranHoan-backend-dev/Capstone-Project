package com.capstone.customer.dto.response;

public record BillResponse(
  String billId,
  String billName,
  String note,
  String exportAddress,
  String totalAmount,
  String amountNeedToPay,
  String payDate,
  Object usageHistory,
  CustomerResponse customer
) {
}
