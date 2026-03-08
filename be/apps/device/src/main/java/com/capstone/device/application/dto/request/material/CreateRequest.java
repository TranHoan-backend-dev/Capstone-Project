package com.capstone.device.application.dto.request.material;

import com.capstone.device.infrastructure.util.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(description = "Request DTO for Material")
public record CreateRequest(
  @Schema(description = "Job content / Description of the material", example = "Đào đất bằng thủ công")
  @NotBlank(message = Constant.ENT_47)
  @NotEmpty(message = Constant.ENT_47)
  String laborCode,

  @Schema(description = "Job content / Description of the material", example = "Đào đất bằng thủ công")
  @NotBlank(message = Constant.ENT_05)
  @NotEmpty(message = Constant.ENT_05)
  String jobContent,

  @Schema(description = "Material price", example = "100000.00")
  @NotNull(message = Constant.ENT_03)
  @DecimalMin(value = "1.0", message = Constant.ENT_12)
  @Positive
  BigDecimal price,

  @Schema(description = "Labor price", example = "50000.00")
  @NotNull(message = Constant.ENT_06)
  @DecimalMin(value = "1.0", message = Constant.ENT_07)
  @Positive
  BigDecimal laborPrice,

  @Schema(description = "Labor price at rural commune", example = "45000.00")
  @NotNull(message = Constant.ENT_09)
  @DecimalMin(value = "1.0", message = Constant.ENT_08)
  @Positive
  BigDecimal laborPriceAtRuralCommune,

  @Schema(description = "Construction machinery price", example = "20000.00")
  @NotNull(message = Constant.ENT_10)
  @DecimalMin(value = "1.0", message = Constant.ENT_29)
  @Positive
  BigDecimal constructionMachineryPrice,

  @Schema(description = "Construction machinery price at rural commune", example = "18000.00")
  @NotNull(message = Constant.ENT_21)
  @DecimalMin(value = "1.0", message = Constant.ENT_211)
  @Positive
  BigDecimal constructionMachineryPriceAtRuralCommune,

  @Schema(description = "Materials group ID", example = "group-uuid")
  @NotBlank(message = Constant.ENT_45)
  @NotEmpty(message = Constant.ENT_45)
  String groupId,

  @Schema(description = "Calculation unit ID", example = "unit-uuid")
  @NotBlank(message = Constant.ENT_46)
  @NotEmpty(message = Constant.ENT_46)
  String unitId) {
}
