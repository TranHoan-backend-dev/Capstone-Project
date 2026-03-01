package com.capstone.device.application.dto.request.metertype;

import com.capstone.device.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Yêu cầu tạo mới loại đồng hồ nước")
public record CreateRequest(
  @Schema(description = "Tên loại đồng hồ", example = "Đồng hồ nước lạnh")
  @NotBlank(message = Constant.ENT_01) String name,

  @Schema(description = "Xuất xứ", example = "Việt Nam")
  @NotBlank(message = Constant.ENT_14) String origin,

  @Schema(description = "Model đồng hồ", example = "LXS-15")
  @NotBlank(message = Constant.ENT_15) String meterModel,

  @Schema(description = "Kích cỡ (mm)", example = "15")
  @NotNull(message = "Kích cỡ là bắt buộc")
  @Positive(message = Constant.ENT_11) Integer size,

  @Schema(description = "Chỉ số tối đa", example = "99999")
  @NotBlank(message = Constant.ENT_28) String maxIndex,

  @Schema(description = "Lưu lượng định mức Qn", example = "1.5")
  @NotBlank(message = Constant.ENT_26) String qn,

  @Schema(description = "Lưu lượng chuyển tiếp Qt", example = "0.12")
  @NotBlank(message = Constant.ENT_27) String qt,

  @Schema(description = "Lưu lượng tối thiểu Qmin", example = "0.03")
  @NotBlank(message = Constant.ENT_25) String qmin,

  @Schema(description = "Đường kính (mm)", example = "21.0")
  @NotNull(message = "Đường kính là bắt buộc")
  @Positive(message = Constant.ENT_16) Float diameter
) {
}
