package com.capstone.device.application.dto.request.metertype;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "Yêu cầu tìm kiếm và lọc loại đồng hồ nước")
@Builder
public record SearchWaterMeterTypeRequest(
  @Schema(description = "Từ khóa tìm kiếm (tìm trong tất cả các trường)", example = "lạnh")
  String search,

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
  Float diameter
) {
}
