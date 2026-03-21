package com.capstone.construction.application.dto.request.receipt;

import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record CreateRequest(
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

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
  @Pattern(regexp = SharedConstant.DATE_PATTERN)
  LocalDate paymentDate,

  @NotNull(message = "Trạng thái thanh toán không được để trống")
  Boolean isPaid,

  @Schema(description = "Url chữ ký của người tạo phiếu thu")
  String significanceOfReceiptCreator,

  @Schema(description = "Url chữ ký của thủ quỹ")
  String significanceOfTreasurer
) {
}
