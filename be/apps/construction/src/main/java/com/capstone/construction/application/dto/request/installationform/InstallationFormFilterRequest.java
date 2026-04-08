package com.capstone.construction.application.dto.request.installationform;

import com.capstone.common.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationFormFilterRequest extends BaseFilterRequest {
  @Schema(description = """
      Lọc theo trạng thái đơn lắp đặt:
      - REGISTRATION_APPROVED: Đơn đang xử lý thiết kế (đang làm dự toán)
      - REGISTRATION_PENDING_FOR_APPROVAL: Đơn đang chờ xử lý (chờ duyệt khảo sát)
      """, example = "REGISTRATION_APPROVED")
  Status status;

  public enum Status {
    REGISTRATION_APPROVED,
    REGISTRATION_PENDING_FOR_APPROVAL,
  }
}
