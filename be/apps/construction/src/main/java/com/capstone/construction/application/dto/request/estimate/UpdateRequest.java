package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "")
public record UpdateRequest(
  @Schema(description = "", example = "Trần Văn A")
  String customerName,

  @Schema(description = "", example = "123 Đường ABC, Phường X, Quận Y")
  String address,

  @Schema(description = "", example = "Khách hàng yêu cầu lắp nhanh")
  String note,

  @Schema(description = "", example = "2000000")
  Integer contractFee,

  @Schema(description = "", example = "100000")
  Integer surveyFee,

  @Schema(description = "", example = "1")
  Integer surveyEffort,

  @Schema(description = "", example = "1500000")
  Integer installationFee,

  @Schema(description = "", example = "20")
  Integer laborCoefficient,

  @Schema(description = "", example = "5")
  Integer generalCostCoefficient,

  @Schema(description = "", example = "10")
  Integer precalculatedTaxCoefficient,

  @Schema(description = "", example = "0")
  Integer constructionMachineryCoefficient,

  @Schema(description = "", example = "10")
  Integer vatCoefficient,

  @Schema(description = "", example = "2")
  Integer designCoefficient,

  @Schema(description = "", example = "500000")
  Integer designFee,

  @Schema(description = "", example = "http://storage.com/design.png")
  MultipartFile designImage,

  @Schema(description = "", example = "PROCESSING")
  ProcessingStatus status,

  @Schema(description = "", example = "SN12345678")
  String waterMeterSerial,

  @Schema(description = "", example = "")
  String overallWaterMeterId
) {
}
