package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.dto.request.construction.AssignRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.usecase.ConstructionRequestUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/construction")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Construction", description = "Quản lý đơn chờ thi công")
public class ConstructionController {
  ConstructionRequestUseCase useCase;
  ConstructionRequestService constructionRequestService;
  @NonFinal
  Logger log;

  @Operation(summary = "Lấy danh sách đơn lắp đặt chờ thi công", description = """
    API này cho phép nhân viên tiếp nhận hồ sơ lấy danh sách các đơn yêu cầu lắp đặt nước đã được duyệt và đang ở trạng thái chờ thi công. <br/>
    Hỗ trợ phân trang và lọc theo từ khóa hoặc khoảng thời gian.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = InstallationFormListResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Định dạng ngày không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/construction")
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'CONSTRUCTION_DEPARTMENT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getConstructionOrdersList(
    @Parameter(description = "Thông tin phân trang (page, size, sort)") Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request
  ) {
    log.info("Received request to fetch construction orders list");
    var response = useCase.getPaginatedConstructionRequest(pageable, request);
    return Utils.returnOkResponse("Lấy danh sách đơn chờ thi công thành công", response);
  }

  @Operation(summary = "Giao thi công cho đội trưởng", description = """
    API này cho phép nhân viên tiếp nhận hồ sơ gán đơn chờ lắp đặt cho một đội trưởng đội thi công. <br/>
    Đồng thời tạo đơn chờ thi công mới và gửi thông báo qua RabbitMQ cho trưởng phòng chi nhánh Xây lắp.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Giao thi công thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc sai vai trò nhân viên", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<?> assignConstructionOrder(
    @Parameter(description = "ID của đội trưởng được giao việc") @PathVariable String id,
    @RequestBody AssignRequest request
  ) {
    log.info("Received request to assign construction order");
    useCase.assignToConstructionCaptain(request, id);
    return Utils.returnOkResponse("Giao thi công thành công", null);
  }

  @Operation(summary = "Cập nhật đội trưởng đội thi công trong đơn chờ", description = """
    API này cho phép cập nhật nhân viên trực tiếp thực hiện thi công.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn chờ thi công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PatchMapping("/pending-requests/{id}/{empId}")
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateConstructionPendingRequest(
    @Parameter(description = "ID của đơn chờ thi công") @PathVariable String id,
    @Parameter(description = "ID của đội trưởng đội thi công") @PathVariable String empId
  ) {
    log.info("Received request to update pending construction request: {}", id);
    constructionRequestService.updatePendingRequest(id, empId);
    return Utils.returnOkResponse("Cập nhật đơn chờ thi công thành công", null);
  }
}
