package com.capstone.construction.application.dto.request.installationform;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.domain.model.utils.Representative;
import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record NewOrderRequest(
  @Schema(description = "Mã biểu mẫu (ví dụ: BM-01)", example = "BM-01")
  @NotBlank(message = Constant.PT_08)
  @NotEmpty(message = Constant.PT_08)
  String formCode,

  @Schema(description = "Số hồ sơ duy nhất để định danh yêu cầu lắp đặt", example = "LF-2024-002")
  @NotBlank(message = Constant.PT_44) String formNumber,

  @Schema(description = "Họ và tên khách hàng (hoặc tên đơn vị)", example = "Nguyễn Văn A")
  @NotBlank(message = Constant.PT_27) String customerName,

  @Schema(description = "Địa chỉ lắp đặt dịch vụ", example = "123 Đường ABC, Phường X, Quận Y, TP. HCM")
  @NotBlank(message = Constant.PT_12) String address,

  @Schema(description = "Số Căn cước công dân / Chứng minh nhân dân", example = "012345678901")
  @NotBlank(message = Constant.PT_48)
  String citizenIdentificationNumber,

  @Schema(description = "Ngày cấp Căn cước công dân (YYYY-MM-DD)", example = "2020-01-01")
  @NotBlank(message = Constant.PT_49)
  String citizenIdentificationProvideDate,

  @Schema(description = "Nơi cấp Căn cước công dân", example = "Cục Cảnh sát QLHC về TTXH")
  @NotBlank(message = Constant.PT_50)
  String citizenIdentificationProvideLocation,

  @Schema(description = "Số điện thoại liên lạc", example = "0901234567")
  @NotBlank(message = Constant.PT_15)
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = Constant.PT_14)
  String phoneNumber,

  @Schema(description = "Mã số thuế (nếu có)", example = "8001234567")
  @NotBlank(message = Constant.PT_51) String taxCode,

  @Schema(description = "Số tài khoản ngân hàng", example = "123456789")
  @NotBlank(message = Constant.PT_52)
  String bankAccountNumber,

  @Schema(description = "Ngân hàng và chi nhánh", example = "Vietcombank HCM")
  @NotBlank(message = Constant.PT_53)
  String bankAccountProviderLocation,

  @Schema(description = "Mục đích sử dụng (DOMESTIC, INSTITUTIONAL, INDUSTRIAL, COMMERCIAL)", example = "DOMESTIC")
  @NotNull(message = Constant.PT_54)
  UsageTarget usageTarget,

  @Schema(description = "Loại khách hàng (FAMILY: Hộ gia đình, COMPANY: Công ty/Tổ chức)", example = "FAMILY")
  @NotNull(message = Constant.PT_06)
  CustomerType customerType,

  @Schema(description = "Ngày tiếp nhận hồ sơ (ISO)", example = "2024-02-01")
  @NotBlank(message = Constant.PT_55)
  @NotEmpty(message = Constant.PT_55)
  String receivedFormAt,

  @Schema(description = "Ngày dự kiến khảo sát (ISO)", example = "2024-02-05")
  @NotBlank(message = Constant.PT_78)
  @NotEmpty(message = Constant.PT_78)
  String scheduleSurveyAt,

  @Schema(description = "Số hộ sử dụng chung đồng hồ", example = "1")
  Integer numberOfHousehold,

  @Schema(description = "Số nhân khẩu", example = "1")
  Integer householdRegistrationNumber,

  @Schema(description = "Danh sách người đại diện (dành cho tổ chức/doanh nghiệp)")
  List<Representative> representative,

  @Schema(description = "ID của mạng lưới cấp nước quản lý", example = "net-001")
  @NotBlank(message = Constant.PT_59)
  @NotEmpty(message = Constant.PT_59)
  String networkId,

  @Schema(description = "ID của nhân viên lập hồ sơ", example = "emp-001")
  @NotBlank(message = Constant.PT_61)
  String createdBy,

  @Schema(description = "ID của đồng hồ nước tổng khu vực", example = "owm-001")
  @NotBlank(message = Constant.PT_62)
  String overallWaterMeterId
) {
}
