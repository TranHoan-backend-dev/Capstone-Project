package com.capstone.notification.dto.request;

import com.capstone.notification.event.websocket.Topic;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Schema(description = "Yêu cầu tạo thông báo cho phòng ban")
public record CreateDepartmentNotificationRequest(
  @Schema(description = "Tiêu đề thông báo", example = "Họp phòng ban")
  @NotBlank
  @NotEmpty
  String title,

  @Schema(description = "Nội dung chi tiết thông báo", example = "Mọi người tập trung tại phòng họp A.")
  @NotEmpty
  @NotBlank
  String message,

  @Schema(description = "Đường dẫn liên kết đính kèm", example = "/meeting/456")
  String link,

  @Schema(description = "Danh sách mã phòng ban nhận thông báo")
  List<Topic> targetDepartmentCodes
) {
}

