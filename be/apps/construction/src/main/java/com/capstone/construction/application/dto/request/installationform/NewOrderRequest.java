package com.capstone.construction.application.dto.request.installationform;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.domain.model.utils.Representative;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record NewOrderRequest(
  @Schema(description = "Mã biểu mẫu", example = "8465165167")
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @Schema(description = "Số hồ sơ duy nhất để định danh yêu cầu lắp đặt", example = "0026987662")
  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  @Schema(description = "Họ và tên khách hàng (hoặc tên đơn vị)", example = "Nguyễn Văn A")
  @NotBlank(message = Message.PT_14) String customerName,

  @Schema(description = "Địa chỉ lắp đặt dịch vụ", example = "123 Đường ABC, Phường X, Quận Y, TP. HCM")
  @NotBlank(message = SharedMessage.MES_06) String address,

  @Schema(description = "Số Căn cước công dân / Chứng minh nhân dân", example = "012345678901")
  @NotBlank(message = SharedMessage.MES_10)
  String citizenIdentificationNumber,

  @Schema(description = "Ngày cấp Căn cước công dân (YYYY-MM-DD)", example = "2020-01-01")
  @NotNull(message = Message.PT_30)
  LocalDate citizenIdentificationProvideDate,

  @Schema(description = "Nơi cấp Căn cước công dân", example = "Cục Cảnh sát QLHC về TTXH")
  @NotBlank(message = SharedMessage.MES_16)
  String citizenIdentificationProvideLocation,

  @Schema(description = "Số điện thoại liên lạc", example = "0901234567")
  @NotBlank(message = SharedMessage.MES_03)
  @Pattern(regexp = SharedConstant.PHONE_PATTERN, message = SharedMessage.MES_04)
  String phoneNumber,

  @Schema(description = "Mã số thuế (nếu có)", example = "8001234567")
  String taxCode,

  @Schema(description = "Số tài khoản ngân hàng", example = "123456789")
  @NotBlank(message = SharedMessage.MES_13)
  String bankAccountNumber,

  @Schema(description = "Ngân hàng và chi nhánh", example = "Vietcombank HCM")
  @NotBlank(message = SharedMessage.MES_17)
  String bankAccountProviderLocation,

  @Schema(description = "Mục đích sử dụng (DOMESTIC, INSTITUTIONAL, INDUSTRIAL, COMMERCIAL)", example = "DOMESTIC")
  @NotNull(message = Message.PT_32)
  UsageTarget usageTarget,

  @Schema(description = "Loại khách hàng (FAMILY: Hộ gia đình, COMPANY: Công ty/Tổ chức)", example = "FAMILY")
  @NotNull(message = Message.PT_06)
  CustomerType customerType,

  @Schema(description = "Ngày tiếp nhận hồ sơ (ISO)", example = "2024-02-01")
  @NotNull(message = Message.PT_33)
  LocalDate receivedFormAt,

  @Schema(description = "Ngày dự kiến khảo sát (ISO)", example = "2024-02-05")
  @NotNull(message = Message.PT_51)
  LocalDate scheduleSurveyAt,

  @Schema(description = "Số hộ sử dụng chung đồng hồ", example = "1")
  @Positive(message = "Số hộ sử dụng phải lớn hơn 1")
  Integer numberOfHousehold,

  @Schema(description = "Số hộ khẩu", example = "1123128398749812")
  @Positive(message = "Số hộ khẩu phải đúng định dạng")
  Integer householdRegistrationNumber,

  @Schema(description = "Danh sách người đại diện (dành cho tổ chức/doanh nghiệp)")
  List<Representative> representative,

  @Schema(description = "ID của mạng lưới cấp nước quản lý", example = "net-001")
  @NotBlank(message = Message.PT_34)
  @NotEmpty(message = Message.PT_34)
  String networkId,

  @Schema(description = "ID của đồng hồ nước tổng khu vực", example = "owm-001")
  @NotBlank(message = Message.PT_37)
  String overallWaterMeterId
) {
}
