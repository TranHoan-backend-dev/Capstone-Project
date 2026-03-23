package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Schema(description = "Yêu cầu phân công ký duyệt dự toán")
public record AssignTheSignificanceRequest(
  @Schema(description = "ID của dự toán", example = "EST-001")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String estId,

  @Schema(description = "ID của nhân viên khảo sát thực hiện ký", example = "EMP001")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String surveyStaff,

  @Schema(description = "ID của Trưởng phòng Kế hoạch kỹ thuật ký", example = "EMP002")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String plHead,

  @Schema(description = "ID của Lãnh đạo công ty ký", example = "EMP003")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String companyLeadership
) {
}
