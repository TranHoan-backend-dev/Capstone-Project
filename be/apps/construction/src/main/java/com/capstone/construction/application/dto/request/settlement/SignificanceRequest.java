package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Yêu cầu ký duyệt quyết toán bởi các bên liên quan")
public record SignificanceRequest(
  @Schema(description = "Chữ ký", example = "http://localhost")
  String url
) {
}
