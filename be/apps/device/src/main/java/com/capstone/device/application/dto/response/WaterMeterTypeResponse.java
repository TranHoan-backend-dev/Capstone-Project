package com.capstone.device.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Thông tin phản hồi của loại đồng hồ nước")
public record WaterMeterTypeResponse(
  @Schema(description = "ID của loại đồng hồ", example = "uuid-123")
  String typeId,

  @Schema(description = "Tên loại đồng hồ", example = "Đồng hồ nước lạnh")
  String name,

  @Schema(description = "Xuất xứ", example = "Việt Nam")
  String origin,

  @Schema(description = "Model đồng hồ", example = "LXS-15")
  String meterModel,

  @Schema(description = "Kích cỡ (mm)", example = "15")
  Integer size,

  @Schema(description = "Chỉ số tối đa", example = "99999")
  String maxIndex,

  @Schema(description = "Lưu lượng định mức Qn", example = "1.5")
  String qn,

  @Schema(description = "Lưu lượng chuyển tiếp Qt", example = "0.12")
  String qt,

  @Schema(description = "Lưu lượng tối thiểu Qmin", example = "0.03")
  String qmin,

  @Schema(description = "Đường kính (mm)", example = "21.0")
  Float diameter,

  @Schema(description = "Thời gian tạo")
  LocalDateTime createdAt,

  @Schema(description = "Thời gian cập nhật")
  LocalDateTime updatedAt
) {
}
