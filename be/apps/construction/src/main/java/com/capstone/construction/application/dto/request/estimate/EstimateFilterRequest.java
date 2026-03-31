package com.capstone.construction.application.dto.request.estimate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record EstimateFilterRequest(
  @Schema(description = "Từ khóa tìm kiếm (tên khách hàng, địa chỉ, ghi chú)", example = "Nguyễn Văn A")
  String keyword,

  @Schema(description = "Ngày bắt đầu lọc (dd-MM-yyyy)", example = "01-01-2023")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
  String from,

  @Schema(description = "Ngày kết thúc lọc (dd-MM-yyyy)", example = "31-12-2023")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
  String to,

  @Schema(description = "Tên khách hàng", example = "Nguyễn Văn A")
  String customerName,

  @Schema(description = "Địa chỉ", example = "Hà Nội")
  String address,

  @Schema(description = "Ghi chú", example = "Khách hàng ưu tiên")
  String note,

  @Schema(description = "Phí hợp đồng", example = "1000000")
  Integer contractFee,

  @Schema(description = "Phí khảo sát", example = "500000")
  Integer surveyFee,

  @Schema(description = "Công sức khảo sát", example = "1")
  Integer surveyEffort,

  @Schema(description = "Phí lắp đặt", example = "300000")
  Integer installationFee,

  @Schema(description = "Hệ số nhân công", example = "1")
  Integer laborCoefficient,

  @Schema(description = "Hệ số chi phí chung", example = "1")
  Integer generalCostCoefficient,

  @Schema(description = "Hệ số thuế tính trước", example = "1")
  Integer precalculatedTaxCoefficient,

  @Schema(description = "Hệ số máy móc thi công", example = "1")
  Integer constructionMachineryCoefficient,

  @Schema(description = "Hệ số VAT", example = "1")
  Integer vatCoefficient,

  @Schema(description = "Hệ số thiết kế", example = "1")
  Integer designCoefficient,

  @Schema(description = "Phí thiết kế", example = "200000")
  Integer designFee,

  @Schema(description = "Ngày đăng ký", example = "01-01-2023")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
  String registrationAt,

  @Schema(description = "Người tạo", example = "admin")
  String createBy,

  @Schema(description = "Số serial đồng hồ nước", example = "SN123456")
  String waterMeterSerial,

  @Schema(description = "ID đồng hồ nước tổng", example = "OWM001")
  String overallWaterMeterId,

  @Schema(description = "URL ảnh thiết kế", example = "https://storage.googleapis.com/...")
  String designImageUrl
) {
}