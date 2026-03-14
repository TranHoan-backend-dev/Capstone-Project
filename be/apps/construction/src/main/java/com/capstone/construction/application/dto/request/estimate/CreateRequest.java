package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

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

  @Schema(description = "Ghi chú thêm", example = "Khách hàng yêu cầu lắp nhanh")
  String note,

  @Schema(description = "Phí hợp đồng", example = "2000000")
  @NotNull(message = Message.PT_15)
  Integer contractFee,

  @Schema(description = "Phí khảo sát", example = "100000")
  @NotNull(message = Message.PT_16)
  Integer surveyFee,

  @Schema(description = "Ccông khảo sát", example = "1")
  @NotNull(message = Message.PT_17)
  Integer surveyEffort,

  @Schema(description = "Phí lắp đặt", example = "1500000")
  @NotNull(message = SharedMessage.MES_15)
  Integer installationFee,

  @Schema(description = "Hệ số nhân công (%)", example = "20")
  @NotNull(message = Message.PT_18)
  Integer laborCoefficient,

  @Schema(description = "Hệ số chi phí chung (%)", example = "5")
  @NotNull(message = Message.PT_19)
  Integer generalCostCoefficient,

  @Schema(description = "Hệ số thuế tính trước (%)", example = "10")
  @NotNull(message = Message.PT_20)
  Integer precalculatedTaxCoefficient,

  @Schema(description = "Hệ số máy thi công (%)", example = "0")
  @NotNull(message = Message.PT_21)
  Integer constructionMachineryCoefficient,

  @Schema(description = "Hệ số thuế GTGT (VAT) (%)", example = "10")
  @NotNull(message = Message.PT_22)
  Integer vatCoefficient,

  @Schema(description = "Hệ số thiết kế (%)", example = "2")
  @NotNull(message = Message.PT_23)
  Integer designCoefficient,

  @Schema(description = "Phí thiết kế", example = "500000")
  @NotNull(message = Message.PT_24)
  Integer designFee,

  @Schema(description = "Đường dẫn ảnh thiết kế", example = "http://storage.com/design.png")
  @NotBlank(message = Message.PT_25)
  @NotEmpty(message = Message.PT_25)
  String designImageUrl,

  @Schema(description = "Ngày đăng ký", example = "2023-10-27")
  @NotNull(message = Message.PT_39)
  LocalDate registrationAt,

  @Schema(description = "ID người tạo", example = "user-123")
  @NotBlank(message = Message.PT_26)
  @NotEmpty(message = Message.PT_26)
  String createBy,

  @Schema(description = "Số sê-ri đồng hồ nước", example = "SN12345678")
  @NotBlank(message = Message.PT_59)
  @NotEmpty(message = Message.PT_59)
  String waterMeterSerial,

  @Schema(description = "ID đồng hồ nước tổng", example = "OWM-98765")
  @NotBlank(message = Message.PT_64)
  @NotEmpty(message = Message.PT_64)
  String overallWaterMeterId,

  @Schema(description = "Mã đơn", example = "FORM-01")
  @NotBlank(message = Message.PT_08)
  @NotEmpty(message = Message.PT_08)
  String formCode,

  @Schema(description = "Số đơn", example = "0000001")
  @NotBlank(message = Message.PT_28)
  @NotEmpty(message = Message.PT_28)
  String formNumber
) {
}
