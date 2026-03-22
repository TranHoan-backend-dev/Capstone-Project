package com.capstone.customer.dto.request.customer;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import io.swagger.v3.oas.annotations.Parameter;
import org.springdoc.core.annotations.ParameterObject;

@ParameterObject
public record CustomerFilterRequest(
  @Parameter(description = "Từ khóa tìm kiếm (tên, email, số điện thoại, mã biểu mẫu vân vân)")
  String search,
  
  @Parameter(description = "Tên khách hàng")
  String name,
  
  @Parameter(description = "Email khách hàng")
  String email,
  
  @Parameter(description = "Số điện thoại")
  String phoneNumber,
  
  @Parameter(description = "Loại khách hàng")
  CustomerType type,
  
  @Parameter(description = "Là khách hàng lớn")
  Boolean isBigCustomer,
  
  @Parameter(description = "Mục đích sử dụng")
  UsageTarget usageTarget,
  
  @Parameter(description = "Số hộ gia đình")
  Integer numberOfHouseholds,
  
  @Parameter(description = "Số nhân khẩu")
  Integer householdRegistrationNumber,
  
  @Parameter(description = "Phí bảo vệ môi trường")
  Integer protectEnvironmentFee,
  
  @Parameter(description = "Miễn phí")
  Boolean isFree,
  
  @Parameter(description = "Đang giảm giá")
  Boolean isSale,
  
  @Parameter(description = "Số m3 giảm")
  String m3Sale,
  
  @Parameter(description = "Tỉ lệ cố định")
  String fixRate,
  
  @Parameter(description = "Phí lắp đặt")
  Integer installationFee,
  
  @Parameter(description = "Kỳ khấu trừ")
  String deductionPeriod,
  
  @Parameter(description = "Phí thuê hàng tháng")
  Integer monthlyRent,
  
  @Parameter(description = "Loại đồng hồ nước")
  String waterMeterType,
  
  @Parameter(description = "Số CCCD/CMND")
  String citizenIdentificationNumber,
  
  @Parameter(description = "Nơi cấp CCCD/CMND")
  String citizenIdentificationProvideAt,
  
  @Parameter(description = "Phương thức thanh toán")
  String paymentMethod,
  
  @Parameter(description = "Số tài khoản ngân hàng")
  String bankAccountNumber,
  
  @Parameter(description = "Tên nơi cấp ngân hàng")
  String bankAccountProviderLocation,
  
  @Parameter(description = "Tên chủ tài khoản")
  String bankAccountName,
  
  @Parameter(description = "Mã kết nối ngân sách")
  String budgetRelationshipCode,
  
  @Parameter(description = "Mã hộ chiếu")
  String passportCode,
  
  @Parameter(description = "Điểm kết nối")
  String connectionPoint,
  
  @Parameter(description = "Trạng thái hoạt động")
  Boolean isActive,
  
  @Parameter(description = "Lý do hủy")
  String cancelReason,
  
  @Parameter(description = "Số biểu mẫu")
  String formNumber,
  
  @Parameter(description = "Mã biểu mẫu")
  String formCode,
  
  @Parameter(description = "Mã giá nước")
  String waterPriceId,
  
  @Parameter(description = "Mã đồng hồ nước")
  String waterMeterId
) {}
