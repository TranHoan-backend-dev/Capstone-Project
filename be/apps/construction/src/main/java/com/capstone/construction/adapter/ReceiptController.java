package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.usecase.ReceiptUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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

  @PostMapping
  @PreAuthorize("hasAnyAuthority('FINANCE_STAFF', 'IT_STAFF')")
  @Operation(summary = "Tạo mới biên lai", description = "Tạo mới biên lai thanh toán cho một đơn lắp đặt.")
  public ResponseEntity<WrapperApiResponse> createReceipt(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create receipt for form: {}/{}", request.formCode(), request.formNumber());
    var response = receiptUseCase.createReceipt(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo biên lai thành công");
  }

  @PutMapping
  @PreAuthorize("hasAnyAuthority('FINANCE_STAFF', 'IT_STAFF')")
  @Operation(summary = "Cập nhật biên lai", description = "Cập nhật thông tin biên lai hiện có.")
  public ResponseEntity<WrapperApiResponse> updateReceipt(
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update receipt for form: {}/{}", request.formCode(), request.formNumber());
    var response = receiptUseCase.updateReceipt(request);
    return Utils.returnOkResponse("Cập nhật biên lai thành công", response);
  }

  @DeleteMapping("/{formCode}/{formNumber}")
  @PreAuthorize("hasAnyAuthority('FINANCE_STAFF', 'IT_STAFF')")
  @Operation(summary = "Xóa biên lai", description = "Xóa biên lai thanh toán.")
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
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'FINANCE_STAFF', 'ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> getReceipt(
    @PathVariable String formCode,
    @PathVariable String formNumber
  ) {
    log.info("REST request to get receipt for form: {}/{}", formCode, formNumber);
    var response = receiptUseCase.getReceipt(formCode, formNumber);
    return Utils.returnOkResponse("Lấy thông tin biên lai thành công", response);
  }
}
