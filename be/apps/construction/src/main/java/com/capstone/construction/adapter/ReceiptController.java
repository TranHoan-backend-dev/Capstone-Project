package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.ReceiptFilterRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptListResponse;
import com.capstone.construction.application.usecase.ReceiptUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AppLog
@RestController
@RequestMapping("/receipts")
@RequiredArgsConstructor
@Tag(name = "Quản lý biên lai", description = "Các API phục vụ việc quản lý biên lai thanh toán.")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReceiptController {
  ReceiptUseCase receiptUseCase;
  ReceiptService service;

  @PostMapping
  @PreAuthorize("hasAnyAuthority('FINANCE_DEPARTMENT', 'IT_STAFF')")
  @Operation(summary = "Tạo mới biên lai", description = "Tạo mới biên lai thanh toán. Yêu cầu hồ sơ đã có dự toán được duyệt đầy đủ.")
  @ApiResponse(responseCode = "201", description = "Tạo biên lai thành công")
  @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc dự toán chưa được duyệt", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  public ResponseEntity<WrapperApiResponse> createReceipt(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create receipt for form: {}/{}", request.formCode(), request.formNumber());
    var response = receiptUseCase.createReceipt(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo biên lai thành công");
  }

  @PutMapping
  @PreAuthorize("hasAnyAuthority('FINANCE_DEPARTMENT', 'IT_STAFF')")
  @Operation(summary = "Cập nhật biên lai", description = "Cập nhật thông tin biên lai hiện có.")
  @ApiResponse(responseCode = "200", description = "Cập nhật thành công")
  @ApiResponse(responseCode = "404", description = "Không tìm thấy biên lai")
  public ResponseEntity<WrapperApiResponse> updateReceipt(
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update receipt for form: {}/{}", request.formCode(), request.formNumber());
    var response = receiptUseCase.updateReceipt(request);
    return Utils.returnOkResponse("Cập nhật biên lai thành công", response);
  }

  @DeleteMapping("/{formCode}/{formNumber}")
  @PreAuthorize("hasAnyAuthority('FINANCE_DEPARTMENT', 'IT_STAFF')")
  @Operation(summary = "Xóa biên lai", description = "Xóa biên lai thanh toán.")
  @ApiResponse(responseCode = "200", description = "Xoá thành công")
  public ResponseEntity<WrapperApiResponse> deleteReceipt(
    @PathVariable String formCode,
    @PathVariable String formNumber
  ) {
    log.info("REST request to delete receipt for form: {}/{}", formCode, formNumber);
    receiptUseCase.deleteReceipt(formCode, formNumber);
    return Utils.returnOkResponse("Xóa biên lai thành công", null);
  }

  @GetMapping("/{formCode}/{formNumber}")
  @Operation(summary = "Lấy chi tiết biên lai", description = "Truy xuất thông tin chi tiết một biên lai.")
  @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'FINANCE_DEPARTMENT', 'ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> getReceipt(
    @PathVariable String formCode,
    @PathVariable String formNumber
  ) {
    log.info("REST request to get receipt for form: {}/{}", formCode, formNumber);
    var response = receiptUseCase.getReceipt(formCode, formNumber);
    return Utils.returnOkResponse("Lấy thông tin biên lai thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách biên lai (có phân trang & lọc)", description = "API này cho phép lấy danh sách các biên lai. Hỗ trợ phân trang và lọc theo từ khóa (tên khách hàng, địa chỉ, số biên lai) hoặc khoảng thời gian.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công. Trả về danh sách biên lai.", content = @Content(schema = @Schema(implementation = ReceiptListResponse.class))),
    @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu đầu vào (VD: định dạng ngày sai, ngày bắt đầu lớn hơn ngày kết thúc).", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống.", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'FINANCE_DEPARTMENT', 'ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> getReceipts(
    Pageable pageable,
    ReceiptFilterRequest filter
  ) {
    log.info("REST request to get receipts with filter: {}", filter);
    var response = receiptUseCase.getReceipts(filter, pageable);
    return Utils.returnOkResponse("Lấy danh sách biên lai thành công", response);
  }

  @GetMapping("/last")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'ORDER_RECEIVING_STAFF', 'FINANCE_DEPARTMENT')")
  public ResponseEntity<WrapperApiResponse> getLastReceiptId() {
    log.info("REST request to getLastReceiptId");
    return Utils.returnOkResponse("", service.getLastCode());
  }
}
