package com.capstone.construction.application.dto.request.estimate;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "Yêu cầu cập nhật dự toán")
public record UpdateRequest(
  @Schema(description = "Tên khách hàng", example = "Trần Văn A")
  String customerName,

  @Schema(description = "Địa chỉ thi công", example = "123 Đường ABC, Phường X, Quận Y")
  String address,

  @Schema(description = "Ghi chú thêm", example = "Khách hàng yêu cầu lắp nhanh")
  String note,

  @Schema(description = "Phí hợp đồng", example = "2000000")
  Integer contractFee,

  @Schema(description = "Phí khảo sát", example = "100000")
  Integer surveyFee,

  @Schema(description = "Ngày công khảo sát", example = "1")
  Integer surveyEffort,

  @Schema(description = "Phí lắp đặt", example = "1500000")
  Integer installationFee,

  @Schema(description = "Hệ số nhân công (%)", example = "20")
  Integer laborCoefficient,

  @Schema(description = "Hệ số chi phí chung (%)", example = "5")
  Integer generalCostCoefficient,

  @Schema(description = "Hệ số thuế tính trước (%)", example = "10")
  Integer precalculatedTaxCoefficient,

  @Schema(description = "Hệ số máy thi công (%)", example = "0")
  Integer constructionMachineryCoefficient,

  @Schema(description = "Hệ số thuế GTGT (VAT) (%)", example = "10")
  Integer vatCoefficient,

  @Schema(description = "Hệ số thiết kế (%)", example = "2")
  Integer designCoefficient,

  @Schema(description = "Phí thiết kế", example = "500000")
  Integer designFee,

  @Schema(description = "File ảnh thiết kế")
  MultipartFile designImage,

  @Schema(description = "Số sê-ri đồng hồ nước", example = "SN12345678")
  String waterMeterSerial,

  @Schema(description = "ID đồng hồ nước tổng", example = "OWM-98765")
  String overallWaterMeterId
) {
}
