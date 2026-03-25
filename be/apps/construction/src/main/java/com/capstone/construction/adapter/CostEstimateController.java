package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.estimate.EstimateFilterRequest;
import com.capstone.construction.application.dto.request.estimate.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.estimate.SignRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.usecase.CostEstimateUseCase;
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
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/estimates")
@RequiredArgsConstructor
@Tag(name = "Dự toán", description = "API quản lý dự toán lắp đặt nước")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateController {
  Logger log;
  final CostEstimateUseCase estimateUseCase;

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật dự toán", description = """
    Cập nhật thông tin dự toán hiện có theo ID.<br/>
    Nhân viên khảo sát có thể hoàn tất dự toán hoặc lưu bản nháp.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật dự toán thành công", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy dự toán", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateEstimate(
    @PathVariable @Parameter(description = "ID của dự toán", required = true) String id,
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update cost estimate with id: {}", id);
    var response = estimateUseCase.updateEstimate(id, request);
    return Utils.returnOkResponse("Cập nhật dự toán chi phí thành công", response);
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Phê duyệt hoặc từ chối dự toán chi phí", description = "Lưu trạng thái phê duyệt của dự toán chi phí dựa theo ID. Truyền 'true' để phê duyệt, 'false' để từ chối.", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật trạng thái duyệt thành công", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu trạng thái truyền lên không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy dự toán chi phí với ID tương ứng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD')")
  public ResponseEntity<WrapperApiResponse> approveEstimate(
    @PathVariable @Parameter(description = "ID của dự toán", required = true) String id,
    @RequestBody @NonNull @Parameter(description = "Trạng thái duyệt (true = Duyệt, false = Từ chối)") Boolean status
  ) {
    log.info("REST request to update cost estimate's status with id: {}", id);
    var response = estimateUseCase.approveEstimate(id, status);
    return Utils.returnOkResponse("Duyệt dự toán chi phí thành công", response);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF')")
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
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF')")
  public ResponseEntity<WrapperApiResponse> getAllEstimates(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") EstimateFilterRequest request
  ) {
    log.info("REST request to get all cost estimates");
    var response = estimateUseCase.getAllEstimates(pageable, request);
    return Utils.returnOkResponse("Lấy danh sách dự toán chi phí thành công", response);
  }

  @PostMapping("/sign")
  @Operation(summary = "Yêu cầu các bên liên quan ký duyệt dự toán", description = """
    Gửi yêu cầu ký duyệt dự toán đến các bộ phận liên quan: Nhân viên khảo sát, Trưởng phòng Kế hoạch Kỹ thuật và Lãnh đạo công ty.<br/>
    Luồng này sẽ kích hoạt thông báo đến các nhân viên được chỉ định.
    Người thực hiện phải có quyền tương ứng (SURVEY_STAFF, PLANNING_TECHNICAL_DEPARTMENT_HEAD, hoặc IT_STAFF).
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Gửi yêu cầu ký duyệt thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy dự toán hoặc nhân viên", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD')")
  public ResponseEntity<WrapperApiResponse> requireSignificances(@RequestBody @Valid AssignTheSignificanceRequest request) {
    log.info("REST request to sign cost estimate: {}", request);
    estimateUseCase.assignStaffForSignCostEstimate(request);
    return Utils.returnOkResponse("Yêu cầu ký duyệt dự toán thành công", null);
  }

  @PatchMapping("/sign")
  @Operation(summary = "Ký duyệt dự toán", description = """
    Thực hiện ký điện tử cho dự toán.<br/>
    Người ký phải có quyền tương ứng (SURVEY_STAFF, PLANNING_TECHNICAL_DEPARTMENT_HEAD, hoặc COMPANY_LEADERSHIP).
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Ký duyệt thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu ký không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền ký duyệt", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy dự toán", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'SURVEY_STAFF')")
  public ResponseEntity<WrapperApiResponse> sign(
    @RequestBody @Valid SignRequest request,
    @AuthenticationPrincipal Jwt jwt
  ) {
    log.info("Received request to sign cost estimate");
    var id = jwt.getSubject();
    estimateUseCase.signForInstallationRequest(id, request);

    return Utils.returnOkResponse("Ký dự toán thành công", null);
  }
}
