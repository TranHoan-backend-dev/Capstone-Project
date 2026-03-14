package com.capstone.customer.dto.request;

import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.utils.Message;
import com.capstone.customer.model.Representative;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Schema(description = "")
public record ContractRequest(
  @Schema(description = "", example = "HD001")
  @NotBlank(message = Message.ENT_05)
  @NotEmpty(message = Message.ENT_05)
  String contractId,

  @Schema(description = "")
  @NotBlank(message = "")
  @NotEmpty(message = "")
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
