package com.capstone.customer.controller;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.service.boundary.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/roadmap-customers")
@RequiredArgsConstructor
@Tag(name = "Lộ trình - Khách hàng", description = "Các API truy vấn danh sách khách hàng theo lộ trình")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapCustomerController {
  CustomerService customerService;

  @Operation(summary = "Xem danh sách khách hàng trong lộ trình", description = "Cho phép các vai trò IT, nhân viên khảo sát, quản lý kinh doanh và nhân viên ghi thu xem danh sách khách hàng thuộc một lộ trình cụ thể. Hỗ trợ tra cứu nhanh qua từ khóa (tên, SĐT, địa chỉ, mã đồng hồ) và phân trang.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Lấy dữ liệu thành công"),
    @ApiResponse(responseCode = "401", description = "Lỗi xác thực người dùng"),
    @ApiResponse(responseCode = "403", description = "Người dùng không có quyền truy cập"),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống phát sinh")
  })
  @GetMapping("/{roadmapId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> getCustomersByRoadmap(
    @PathVariable @Parameter(description = "ID của lộ trình ghi nước", example = "RM_001") String roadmapId,
    @PageableDefault @ParameterObject Pageable pageable,
    @RequestParam(required = false) @Parameter(description = "Từ khóa tìm kiếm (tên, SĐT, địa chỉ, mã đồng hồ)", example = "Số 1 Phố Huế") String search
  ) {
    log.info("getCustomersByRoadmap");
    var filter = CustomerFilterRequest.fromRoadmapId(roadmapId, search);
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable, filter);
    return Utils.returnOkResponse("Lấy danh sách khách hàng theo lộ trình thành công", response);
  }
}
