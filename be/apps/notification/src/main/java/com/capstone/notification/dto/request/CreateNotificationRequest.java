package com.capstone.notification.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Schema(description = "Yêu cầu tạo thông báo")
public record CreateNotificationRequest(
  @Schema(description = "Tiêu đề thông báo", example = "Bảo trì hệ thống")
  @NotBlank
  @NotEmpty
  String title,

  @Schema(description = "Nội dung chi tiết thông báo", example = "Hệ thống sẽ bảo trì vào lúc 22:00 hôm nay.")
  @NotEmpty
  @NotBlank
  String message,

  @Schema(description = "Đường dẫn liên kết đính kèm", example = "/news/123")
  String link
) {
}
