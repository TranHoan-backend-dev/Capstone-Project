package com.capstone.construction.adapter;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.settlement.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.usecase.SettlementUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/settlements")
@RequiredArgsConstructor
@Tag(name = "Quyết toán", description = "API quản lý và xử lý quyết toán công trình xây lắp")
public class SettlementController {
  private final SettlementUseCase settlementUseCase;

  @PostMapping
  @Operation(summary = "Tạo mới một bản quyết toán công trình", description = "Khởi tạo một bản quyết toán mới dựa trên thông tin công việc, địa chỉ và phí đấu nối.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo quyết toán thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> createSettlement(@RequestBody @Valid SettlementRequest request) {
    log.info("REST request to create settlement for address: {}", request.address());
    var response = settlementUseCase.createSettlement(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo quyết toán công trình thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật thông tin quyết toán công trình", description = "Cập nhật lại các thông tin của bản quyết toán đã tồn tại thông qua ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = SettlementResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bản quyết toán", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ")
  })
  public ResponseEntity<WrapperApiResponse> updateSettlement(
    @PathVariable @Parameter(description = "ID của bản quyết toán cần cập nhật", required = true) String id,
    @RequestBody @Valid SettlementRequest request) {
    log.info("REST request to update settlement with id: {}", id);
    var response = settlementUseCase.updateSettlement(id, request);
    return Utils.returnOkResponse("Cập nhật quyết toán công trình thành công", response);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy thông tin chi tiết quyết toán theo ID", description = "Truy xuất đầy đủ thông tin của một bản quyết toán công trình cụ thể.", responses = {
    @ApiResponse(responseCode = "200", description = "Tìm thấy bản quyết toán", content = @Content(schema = @Schema(implementation = SettlementResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bản quyết toán", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getSettlementById(
    @PathVariable @Parameter(description = "ID của bản quyết toán cần tra cứu", required = true) String id) {
    log.info("REST request to get settlement with id: {}", id);
    var response = settlementUseCase.getSettlementById(id);
    return Utils.returnOkResponse("Lấy thông tin quyết toán công trình thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách tất cả quyết toán công trình", description = "Trả về danh sách phân trang của tất cả các bản quyết toán trong hệ thống.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
  })
  public ResponseEntity<WrapperApiResponse> getAllSettlements(
    @PageableDefault @Parameter(description = "Thông số phân trang (page, size, sort)") Pageable pageable) {
    log.info("REST request to get all settlements");
    var response = settlementUseCase.getAllSettlements(pageable);
    return Utils.returnOkResponse("Lấy danh sách quyết toán công trình thành công", response);
  }

  @GetMapping("/filter")
  @Operation(summary = "Lọc danh sách quyết toán theo tiêu chí", description = "Tìm kiếm và lọc các bản quyết toán dựa trên các tham số như nội dung, trạng thái, ngày đăng ký, chi phí...", responses = {
    @ApiResponse(responseCode = "200", description = "Lọc danh sách thành công")
  })
  public ResponseEntity<WrapperApiResponse> filterSettlements(
    @ModelAttribute @Parameter(description = "Các tiêu chí lọc dữ liệu") SettlementFilterRequest filterRequest,
    @PageableDefault @Parameter(description = "Thông số phân trang") Pageable pageable) {
    log.info("REST request to filter settlements with filterRequest: {}", filterRequest);
    var response = settlementUseCase.filterSettlements(filterRequest, pageable);
    return Utils.returnOkResponse("Lấy danh sách quyết toán công trình thành công", response);
  }

  @PostMapping("/sign/{id}")
  @Operation(summary = "Ký duyệt bản quyết toán", description = """
    Thực hiện ký duyệt điện tử lên bản quyết toán bởi các bên có thẩm quyền liên quan.
    Luồng này sẽ kích hoạt thông báo đến các nhân viên được chỉ định.
    Người thực hiện phải có quyền tương ứng (CONSTRUCTION_DEPARTMENT_HEAD, COMPANY_LEADERSHIP, SURVEY_STAFF, PLANNING_TECHNICAL_DEPARTMENT_HEAD hoặc IT_STAFF).
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Ký thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bản quyết toán"),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này")
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'SURVEY_STAFF')")
  public ResponseEntity<WrapperApiResponse> sign(
    @RequestBody SignificanceRequest request,
    @PathVariable @Parameter(description = "ID của bản quyết toán cần ký", required = true) String id) {
    log.info("Received request to sign construction request: {}", request);
    settlementUseCase.significance(request, id);
    return Utils.returnOkResponse("Ký quyết toán thành công", null);
  }

  @PostMapping("/sign")
  @Operation(summary = "Yêu cầu các bên liên quan ký duyệt quyết toán", description = """
    Gửi yêu cầu ký duyệt quyết toán đến các bộ phận liên quan: Nhân viên khảo sát, Trưởng phòng Kế hoạch Kỹ thuật, Tổng giám đốc và Giám đốc chi nhánh Xây lắp.<br/>
    Luồng này sẽ kích hoạt thông báo đến các nhân viên được chỉ định.
    Người thực hiện phải có quyền tương ứng (CONSTRUCTION_DEPARTMENT_HEAD, CONSTRUCTION_DEPARTMENT_STAFF, hoặc IT_STAFF).
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Gửi yêu cầu ký duyệt thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy quyết toán hoặc nhân viên", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'CONSTRUCTION_DEPARTMENT_STAFF')")
  public ResponseEntity<WrapperApiResponse> requireSignificances(
    @RequestBody @Valid @Parameter(description = "Thông tin phân công các nhân viên thực hiện ký duyệt", required = true) AssignTheSignificanceRequest request) {
    log.info("REST request to sign cost estimate: {}", request);
    settlementUseCase.assignStaffForSignCostEstimate(request);
    return Utils.returnOkResponse("Yêu cầu ký duyệt quyết toán thành công", null);
  }
}
