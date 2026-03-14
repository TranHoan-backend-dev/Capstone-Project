package com.capstone.device.application.dto.request.material;

import com.capstone.device.infrastructure.util.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(description = "Request DTO for Material")
public record CreateRequest(
  @Schema(description = "Job content / Description of the material", example = "Đào đất bằng thủ công")
  @NotBlank(message = Message.ENT_47)
  @NotEmpty(message = Message.ENT_47)
  String laborCode,

  @Schema(description = "Job content / Description of the material", example = "Đào đất bằng thủ công")
  @NotBlank(message = Message.ENT_54)
  @NotEmpty(message = Message.ENT_54)
  String jobContent,

  @Schema(description = "Material price", example = "100000.00")
  @NotNull(message = Message.ENT_03)
  @DecimalMin(value = "1.0", message = Message.ENT_12)
  @Positive
  BigDecimal price,

  @Schema(description = "Labor price", example = "50000.00")
  @NotNull(message = Message.ENT_06)
  @DecimalMin(value = "1.0", message = Message.ENT_07)
  @Positive
  BigDecimal laborPrice,

  @Schema(description = "Labor price at rural commune", example = "45000.00")
  @NotNull(message = Message.ENT_09)
  @DecimalMin(value = "1.0", message = Message.ENT_08)
  @Positive
  BigDecimal laborPriceAtRuralCommune,

  @Schema(description = "Construction machinery price", example = "20000.00")
  @NotNull(message = Message.ENT_10)
  @DecimalMin(value = "1.0", message = Message.ENT_29)
  @Positive
  BigDecimal constructionMachineryPrice,

  @Schema(description = "Construction machinery price at rural commune", example = "18000.00")
  @NotNull(message = Message.ENT_21)
  @DecimalMin(value = "1.0", message = Message.ENT_211)
  @Positive
  BigDecimal constructionMachineryPriceAtRuralCommune,

  @Schema(description = "Materials group ID", example = "group-uuid")
  @NotBlank(message = Message.ENT_45)
  @NotEmpty(message = Message.ENT_45)
  String groupId,

  @Schema(description = "Calculation unit ID", example = "unit-uuid")
  @NotBlank(message = Message.ENT_46)
  @NotEmpty(message = Message.ENT_46)
  String unitId) {
}
