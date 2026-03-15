package com.capstone.customer.dto.request.contract;

import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.model.Representative;
import com.capstone.customer.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Schema(description = "")
public record UpdateRequest(
  @Schema(description = "")
  String customerId,

  @Schema(description = "")
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @Schema(description = "")
  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  @Schema(description = "")
  List<Representative> representatives
) {
}
