package com.capstone.customer.dto.request.customer;

import com.capstone.common.enumerate.UsageTarget;
import io.swagger.v3.oas.annotations.Parameter;
import org.jspecify.annotations.NonNull;
import org.springdoc.core.annotations.ParameterObject;

@ParameterObject
public record CustomerFilterRequest(
  @Parameter(description = "Từ khóa tìm kiếm (tên, email, số điện thoại, mã biểu mẫu vân vân)")
  String search,

  @Parameter(description = "Tên khách hàng")
  String name,

  @Parameter(description = "Số điện thoại")
  String phoneNumber,

  @Parameter(description = "Mục đích sử dụng")
  UsageTarget usageTarget,

  @Parameter(description = "Miễn phí")
  Boolean isFree,

  @Parameter(description = "Số m3 giảm")
  String m3Sale,

  @Parameter(description = "Loại đồng hồ nước")
  String waterMeterType,

  @Parameter(description = "Số CCCD/CMND")
  String citizenIdentificationNumber,

  @Parameter(description = "Số tài khoản ngân hàng")
  String bankAccountNumber,

  @Parameter(description = "Điểm kết nối")
  String connectionPoint,

  @Parameter(description = "Trạng thái hoạt động")
  Boolean isActive,

  @Parameter(description = "Số biểu mẫu")
  String formNumber,

  @Parameter(description = "Mã biểu mẫu")
  String formCode,

  @Parameter(description = "Mã lộ trình ghi")
  String roadmapId
) {
  public static @NonNull CustomerFilterRequest fromRoadmapId(String roadmapId, String search) {
    return new CustomerFilterRequest(
      search, null, null, null,
      null, null, null, null,
      null, null, null, null,
      null, roadmapId
    );
  }
}
