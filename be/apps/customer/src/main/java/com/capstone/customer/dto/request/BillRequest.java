package com.capstone.customer.dto.request;

import com.capstone.customer.utils.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request DTO for creating or updating a Bill")
public record BillRequest(
  @Schema(description = "Customer ID associated with this bill")
  @NotBlank(message = Constant.ENT_06) String customerId,

  @Schema(description = "Bill name / Invoice name", example = "Hóa đơn tiền nước tháng 10")
  @NotBlank(message = Constant.ENT_01) String billName,

  @Schema(description = "Optional note for the bill")
  @NotBlank(message = Constant.ENT_10) String note,

  @Schema(description = "Export/Billing address", example = "123 Đường ABC, Phường X, Quận Y")
  @NotBlank(message = Constant.ENT_03) String exportAddress) {
}
