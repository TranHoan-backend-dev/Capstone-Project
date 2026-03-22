package com.capstone.construction.application.dto.request.settlement;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Schema(description = "Yêu cầu phân công ký duyệt quyết toán")
public record AssignTheSignificanceRequest(
  @Schema(description = "ID của quyết toán", example = "EST-001")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String settlementId,

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
  String companyLeadership,

  @Schema(description = "ID của giám đốc chi nhánh Xây lắp", example = "EMP003")
  String constructionPresident
) {
}
