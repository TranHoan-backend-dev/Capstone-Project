package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "")
public record CreateRequest(
  @Schema(description = "", example = "Trần Văn A")
  @NotBlank(message = SharedMessage.MES_05)
    @NotEmpty(message = SharedMessage.MES_05)
  String customerName,

  @Schema(description = "", example = "123 Đường ABC, Phường X, Quận Y")
  @NotBlank(message = SharedMessage.MES_06)
  @NotEmpty(message = SharedMessage.MES_06)
  String address,

  @Schema(description = "", example = "Khách hàng yêu cầu lắp nhanh")
  String note,

  @Schema(description = "", example = "2000000")
  @NotNull(message = "")
  Integer contractFee,

  @Schema(description = "", example = "100000")
  @NotNull(message = "")
  Integer surveyFee,

  @Schema(description = "", example = "1")
  @NotNull(message = "")
  Integer surveyEffort,

  @Schema(description = "", example = "1500000")
  @NotNull(message = "")
  Integer installationFee,

  @Schema(description = "", example = "20")
  @NotNull(message = "")
  Integer laborCoefficient,

  @Schema(description = "", example = "5")
  @NotNull(message = "")
  Integer generalCostCoefficient,

  @Schema(description = "", example = "10")
  @NotNull(message = "")
  Integer precalculatedTaxCoefficient,

  @Schema(description = "", example = "0")
  @NotNull(message = "")
  Integer constructionMachineryCoefficient,

  @Schema(description = "", example = "10")
  @NotNull(message = "")
  Integer vatCoefficient,

  @Schema(description = "", example = "2")
  @NotNull(message = "")
  Integer designCoefficient,

  @Schema(description = "", example = "500000")
  @NotNull(message = "")
  Integer designFee,

  @Schema(description = "", example = "http://storage.com/design.png")
  @NotBlank(message = "")
  @NotEmpty(message = "")
  String designImageUrl,

  @Schema(description = "", example = "PROCESSING")
  @NotNull(message = "")
  ProcessingStatus status,

  @Schema(description = "", example = "2023-10-27")
  @NotNull(message = "")
  LocalDate registrationAt,

  @Schema(description = "", example = "user-123")
  @NotBlank(message = Message.PT_26)
  @NotEmpty(message = Message.PT_26)
  String createBy,

  @Schema(description = "", example = "SN12345678")
  @NotBlank(message = "")
  @NotEmpty(message = "")
  String waterMeterSerial,

  @Schema(description = "", example = "")
  @NotBlank(message = "")
  @NotEmpty(message = "")
  String overallWaterMeterId,

  @Schema(description = "", example = "")
  @NotBlank(message = Message.PT_08)
  @NotEmpty(message = Message.PT_08)
  String formCode,

  @Schema(description = "", example = "")
  @NotBlank(message = Message.PT_28)
  @NotEmpty(message = Message.PT_28)
  String formNumber
) {
}
