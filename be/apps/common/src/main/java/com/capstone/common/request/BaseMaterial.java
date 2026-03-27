package com.capstone.common.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseMaterial{
  @Schema(description = "Mã vật tư", example = "VT001")
  String materialCode;

  @Schema(description = "Nội dung công việc", example = "Ống nhựa HDPE D20")
  String jobContent;

  @Schema(description = "Ghi chú", example = "Sử dụng loại chịu lực")
  String note;

  @Schema(description = "Đơn vị tính", example = "Mét")
  String unit;

  @Schema(description = "Khối lượng/Số lượng", example = "10.5")
  String mass;

  @Schema(description = "Đơn giá vật tư", example = "50000")
  String materialCost;

  @Schema(description = "Đơn giá nhân công", example = "20000")
  String laborPrice;

  @Schema(description = "Đơn giá nhân công tại xã nông thôn", example = "15000")
  String laborPriceAtRuralCommune;

  @Schema(description = "Tổng giá vật liệu", example = "525000")
  String totalMaterialPrice;

  @Schema(description = "Tổng giá nhân công", example = "210000")
  String totalLaborPrice;
}
