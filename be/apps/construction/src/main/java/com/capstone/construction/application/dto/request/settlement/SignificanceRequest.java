package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Yêu cầu ký duyệt quyết toán bởi các bên liên quan")
public record SignificanceRequest(
  @Schema(description = "Chữ ký của Tổng giám đốc", example = "NGUYEN_VAN_A")
  String president,

  @Schema(description = "Chữ ký của Trưởng phòng Kế hoạch kỹ thuật", example = "TRAN_VAN_B")
  String ptHead,

  @Schema(description = "Chữ ký của Nhân viên khảo sát", example = "LE_VAN_C")
  String surveyStaff,

  @Schema(description = "Chữ ký của Giám đốc chi nhánh Xây lắp", example = "PHAM_VAN_D")
  String constructionPresident) {
}
