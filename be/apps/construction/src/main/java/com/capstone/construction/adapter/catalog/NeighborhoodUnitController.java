package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
import com.capstone.construction.application.usecase.catalog.NeighborhoodUnitUseCase;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/units")
@RequiredArgsConstructor
@Tag(name = "Đơn vị hành chính (Tổ/Khu/Xóm)", description = "Quản lý đơn vị hành chính nhỏ nhất của thành phố, bao gồm tổ dân phố, khu phố và xóm trực thuộc các phường/xã/thị trấn")
public class NeighborhoodUnitController {
  private final NeighborhoodUnitUseCase unitUseCase;

  @PostMapping
  @Operation(summary = "Tạo đơn vị hành chính mới", description = "Tạo mới một đơn vị hành chính (tổ/khu/xóm) thuộc phường/xã/thị trấn chỉ định. Yêu cầu quyền IT_STAFF. Thao tác không idempotent.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo đơn vị hành chính thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (tên hoặc ID phường/xã bị bỏ trống)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện thao tác này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createUnit(@RequestBody @Valid NeighborhoodUnitRequest request) {
    log.info("REST request to create unit: {}", request.name());
    unitUseCase.createUnit(request);
    return Utils.returnCreatedResponse("Tạo tổ/khu/xóm thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật đơn vị hành chính", description = """
    Cập nhật thông tin đơn vị hành chính (tổ/khu/xóm) theo ID. Yêu cầu quyền IT_STAFF. Thao tác idempotent.

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật đơn vị hành chính thành công", content = @Content(schema = @Schema(implementation = NeighborhoodUnitResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn vị hành chính với ID đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateUnit(
    @PathVariable @Parameter(description = "ID of the unit to update", required = true) String id,
    @RequestBody @Valid NeighborhoodUnitRequest request) {
    log.info("REST request to update unit: {}", id);
    var response = unitUseCase.updateUnit(id, request);
    return Utils.returnOkResponse("Cập nhật tổ/khu/xóm thành công", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa đơn vị hành chính", description = """
    Xóa đơn vị hành chính (tổ/khu/xóm) khỏi hệ thống theo ID. Yêu cầu quyền IT_STAFF. Thao tác không thể hoàn tác.

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Xóa đơn vị hành chính thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn vị hành chính với ID đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteUnit(
    @PathVariable @Parameter(description = "ID của đơn vị hành chính cần xóa", required = true) String id) {
    log.info("REST request to delete unit: {}", id);
    unitUseCase.deleteUnit(id);
    return Utils.returnOkResponse("Xóa tổ/khu/xóm thành công", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy thông tin đơn vị hành chính theo ID", description = "Truy vấn chi tiết một đơn vị hành chính (tổ/khu/xóm) theo ID. Không yêu cầu quyền đặc biệt.", responses = {
    @ApiResponse(responseCode = "200", description = "Trả về thông tin chi tiết đơn vị hành chính"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn vị hành chính với ID đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getUnitById(
    @PathVariable @Parameter(description = "ID of the unit to retrieve", required = true) String id) {
    log.info("REST request to get unit: {}", id);
    var response = unitUseCase.getUnitById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Lấy thông tin tổ/khu/xóm thành công", response, LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách toàn bộ đơn vị hành chính", description = "Truy vấn danh sách tất cả các đơn vị hành chính (tổ/khu/xóm) trong hệ thống, hỗ trợ phân trang. Không yêu cầu quyền đặc biệt.", responses = {
    @ApiResponse(responseCode = "200", description = "Trả về danh sách đơn vị hành chính theo trang", content = @Content(schema = @Schema(implementation = NeighborhoodUnitResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllUnits(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable) {
    log.info("REST request to get all units");
    var response = unitUseCase.getAllUnits(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Lấy danh sách tổ/khu/xóm thành công", response, LocalDateTime.now()));
  }
}
