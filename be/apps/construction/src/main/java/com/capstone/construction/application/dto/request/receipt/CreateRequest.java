package com.capstone.construction.application.dto.request.receipt;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateRequest(
  @NotNull(message = SharedMessage.MES_21)
  Long formCode,

  @NotNull(message = SharedMessage.MES_20)
  Long formNumber,

  @NotBlank(message = "Số biên lai không được để trống")
  @NotEmpty(message = "Số biên lai không được để trống")
  String receiptNumber,

  @NotBlank(message = "Địa chỉ không được để trống")
  @NotEmpty(message = "Địa chỉ không được để trống")
  String paymentReason,

  @NotBlank(message = "Số tiền không được để trống")
  @NotEmpty(message = "Số tiền không được để trống")
  String totalMoneyInDigit,

  @NotBlank(message = "Số tiền viết bằng chữ không được để trống")
  @NotEmpty(message = "Địa chỉ viết bằng chữ không được để trống")
  String totalMoneyInCharacters,

  String attach,

  @NotNull(message = "Ngày thanh toán không được để trống")
  LocalDate paymentDate,

  @NotNull(message = "Trạng thái thanh toán không được để trống")
  Boolean isPaid,

  @Schema(description = "Url chữ ký của người tạo phiếu thu")
  String significanceOfReceiptCreator
) {
}
