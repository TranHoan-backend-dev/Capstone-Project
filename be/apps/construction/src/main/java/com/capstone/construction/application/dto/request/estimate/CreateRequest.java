package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Schema(description = "Yêu cầu tạo mới dự toán")
public record CreateRequest(
  @Schema(description = "Tên khách hàng", example = "Trần Văn A")
  @NotBlank(message = SharedMessage.MES_05)
  @NotEmpty(message = SharedMessage.MES_05)
  String customerName,

  @Schema(description = "Địa chỉ thi công", example = "123 Đường ABC, Phường X, Quận Y")
  @NotBlank(message = SharedMessage.MES_06)
  @NotEmpty(message = SharedMessage.MES_06)
  String address,

  @Schema(description = "Ngày đăng ký", example = "2023-10-27")
  @NotNull(message = Message.PT_39)
  LocalDateTime registrationAt,

  @Schema(description = "ID người tạo", example = "user-123")
  @NotBlank(message = Message.PT_26)
  @NotEmpty(message = Message.PT_26)
  String createBy,

  @Schema(description = "Mã đơn", example = "FORM-01")
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @Schema(description = "Số đơn", example = "0000001")
  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  String overallWaterMeterId
) {
}
