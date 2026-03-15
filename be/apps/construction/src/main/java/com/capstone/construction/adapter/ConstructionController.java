package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.usecase.InstallationFormHandlingUseCase;
import com.capstone.construction.domain.model.utils.InstallationFormId;
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
@Tag(name = "", description = "")
public class ConstructionController {
  InstallationFormHandlingUseCase useCase;
  @NonFinal
  Logger log;

  @Operation(summary = "Lấy danh sách đơn lắp đặt chờ thi công", description = """
    API này cho phép nhân viên tiếp nhận hồ sơ lấy danh sách các đơn yêu cầu lắp đặt nước đã được duyệt và đang ở trạng thái chờ thi công. <br/>
    Hỗ trợ phân trang và lọc theo từ khóa hoặc khoảng thời gian.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Định dạng ngày không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/construction")
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getConstructionOrdersList(
    @Parameter(description = "Thông tin phân trang (page, size, sort)") Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request) {
    log.info("Received request to fetch construction orders list");
    var response = useCase.getPaginatedConstructionRequest(pageable, request);
    return Utils.returnOkResponse("Lấy danh sách đơn chờ thi công thành công", response);
  }

  // TODO: test api, unit test, swagger doc
  @PatchMapping("/{id}")
  public ResponseEntity<?> assignConstructionOrder(
    @PathVariable String id, // nv se duoc giao cong trinh
    @RequestBody InstallationFormId request
  ) {
    log.info("Received request to assign construction order");
    useCase.assignInstallationFormToConstructionCaptain(request, id);
    return Utils.returnOkResponse("Giao thi công thành công", null);
  }
}
