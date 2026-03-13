package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.usecase.estimate.CostEstimateUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/estimates")
@RequiredArgsConstructor
@Tag(name = "Dự toán chi phí", description = "API quản lý dự toán chi phí lắp đặt nước")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateController {
  Logger log;
  final CostEstimateUseCase estimateUseCase;

  @PostMapping
  @Operation(summary = "Tạo mới dự toán chi phí", description = "Tạo bản ghi dự toán chi phí mới dựa trên thông tin từ đơn đăng ký lắp đặt", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo dự toán chi phí thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn đăng ký lắp đặt liên quan", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> createEstimate(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create cost estimate for customer: {}", request.customerName());
    var response = estimateUseCase.createEstimate(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo dự toán chi phí thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật dự toán", description = "Cập nhật thông tin dự toán hiện có theo ID", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật dự toán thành công", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy dự toán", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> updateEstimate(
    @PathVariable @Parameter(description = "ID của dự toán chi phí", required = true) String id,
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update cost estimate with id: {}", id);
    var response = estimateUseCase.updateEstimate(id, request);
    return Utils.returnOkResponse("Cập nhật dự toán chi phí thành công", response);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getEstimateById(
    @PathVariable @Parameter(description = "", required = true) String id
  ) {
    log.info("REST request to get cost estimate with id: {}", id);
    var response = estimateUseCase.getEstimateById(id);
    return Utils.returnOkResponse("Lấy thông tin dự toán chi phí thành công", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllEstimates(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request
  ) {
    log.info("REST request to get all cost estimates");
    var response = estimateUseCase.getAllEstimates(pageable, request);
    return Utils.returnOkResponse("Lấy danh sách dự toán chi phí thành công", response);
  }
}
