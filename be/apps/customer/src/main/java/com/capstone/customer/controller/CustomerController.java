package com.capstone.customer.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.service.boundary.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('IT_STAFF', 'ORDER_RECEIVING_STAFF')")
@Tag(name = "Quản lý khách hàng", description = "Các API phục vụ việc quản lý thông tin khách hàng, bao cập nhật, truy vấn và xóa khách hàng.")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
  CustomerService customerService;
  @NonFinal
  Logger log;

  @Operation(summary = "Tạo mới khách hàng", description = "Thêm một khách hàng mới vào hệ thống với đầy đủ thông tin cá nhân và kỹ thuật.", responses = {
    @ApiResponse(responseCode = "201", description = "Khách hàng đã được tạo thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (ví dụ: sai định dạng email, số điện thoại)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createCustomer(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create customer: {}", request.email());
    var response = customerService.createCustomer(request);
    log.info("New customer created: {}", response);
    return Utils.returnCreatedResponse("Tạo khách hàng thành công");
  }

  @Operation(summary = "Cập nhật thông tin khách hàng", description = "Cập nhật dữ liệu của một khách hàng hiện có dựa trên Mã khách hàng (ID).", responses = {
    @ApiResponse(responseCode = "200", description = "Thông tin khách hàng đã được cập nhật", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng với ID đã cung cấp", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateCustomer(
    @PathVariable @Parameter(description = "Id của khách hàng", example = "550e8400-e29b-41d4-a716-446655440000") String id,
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update customer: {}", id);
    var response = customerService.updateCustomer(id, request);
    return Utils.returnOkResponse("Cập nhật khách hàng thành công", response);
  }

  @Operation(summary = "Xóa khách hàng", description = "Xóa vĩnh viễn thông tin khách hàng khỏi hệ thống dựa trên ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Khách hàng đã được xóa thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng để xóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteCustomer(
    @PathVariable @Parameter(description = "Mã khách hàng cần xóa", example = "550e8400-e29b-41d4-a716-446655440000") String id) {
    log.info("REST request to delete customer: {}", id);
    customerService.deleteCustomer(id);
    return Utils.returnOkResponse("Xóa khách hàng thành công", null);
  }

  @Operation(summary = "Lấy chi tiết khách hàng", description = "Truy xuất toàn bộ thông tin chi tiết của một khách hàng cụ thể.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerResponse.class))),
    @ApiResponse(responseCode = "404", description = "Khách hàng không tồn tại", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getCustomerById(
    @PathVariable @Parameter(description = "Mã khách hàng cần lấy thông tin", example = "550e8400-e29b-41d4-a716-446655440000") String id) {
    log.info("REST request to get customer: {}", id);
    var response = customerService.getCustomerById(id);
    return Utils.returnOkResponse("Lấy thông tin khách hàng thành công", response);
  }

  @Operation(summary = "Lấy danh sách khách hàng", description = "Lấy danh sách khách hàng có hỗ trợ phân trang, sắp xếp và tìm kiếm/lọc theo tất cả các trường.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerResponse.class)))
  })
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllCustomers(
    @PageableDefault @ParameterObject Pageable pageable,
    @ParameterObject CustomerFilterRequest filter) {
    log.info("REST request to get all customers with pagination: {} and filter: {}", pageable, filter);
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable, filter);
    return Utils.returnOkResponse("Lấy danh sách khách hàng thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/water-price/{price}")
  public ResponseEntity<?> checkWhetherCustomersAreApplied(@PathVariable("price") @NonNull String waterPriceId) {
    log.info("REST request to check whether customers applied: {}", waterPriceId);
    var response = customerService.areCustomersAppliedThisPrice(waterPriceId);
    log.info("Customer applied: {}", response);
    return Utils.returnOkResponse("Kiểm tra thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/exist")
  public Boolean checkExistenceOfCustomer(@RequestParam String customerId) {
    return customerService.isExistingCustomer(customerId);
  }

  @Operation(hidden = true)
  @GetMapping("/meter/{meterId}")
  public String getCustomerIdByMeterId(@PathVariable String meterId) {
    log.info("REST request to get customer id: {}", meterId);
    return customerService.getIdByMeterId(meterId);
  }
}
