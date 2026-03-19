package com.capstone.construction.application.dto.request.receipt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateRequest(
  @NotBlank(message = "Mã đơn không được để trống") String formCode,
  @NotBlank(message = "Số đơn không được để trống") String formNumber,
  @NotBlank(message = "Số biên lai không được để trống") String receiptNumber,
  @NotBlank(message = "Tên khách hàng không được để trống") String customerName,
  @NotBlank(message = "Địa chỉ không được để trống") String address,
  @NotNull(message = "Ngày thanh toán không được để trống") LocalDate paymentDate,
  @NotNull(message = "Trạng thái thanh toán không được để trống") Boolean isPaid
) {}
