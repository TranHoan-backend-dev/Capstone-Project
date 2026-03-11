package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.UpdateUnitRequest;
import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.application.usecase.UnitUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/units")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Unit Controller", description = "Quản lý các đơn vị tính (Unit). Hỗ trợ các chức năng xem danh sách phân trang và lấy danh sách gợi ý.")
public class UnitController {
  @NonFinal
  Logger log;
  UnitUseCase unitUseCase;

  // TODO:
  // phuc vu cho ca admin lan cac role khac
  // admin thi lay danh sach phan trang (/)
  // role khac thi se lay ra 10 ban ghi co tan suat su dung cao nhat, sau do se
  @Operation(summary = "Lấy danh sách đơn vị tính phân trang", description = "API này cho phép Admin xem danh sách các đơn vị tính, có hỗ trợ phân trang và lọc theo tên.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UnitResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<?> getPaginatedListOfUnits(
      @Parameter(description = "Thông tin phân trang (page, size, sort)") @PageableDefault Pageable pageable,
      @Parameter(description = "Từ khóa lọc theo tên đơn vị tính") @RequestParam(required = false) String filter) {
    log.info("REST request to get paginated list of units: {}, filter: {}", pageable, filter);
    var response = unitUseCase.getUnits(pageable, filter);
    return Utils.returnOkResponse("Get paginated list of units successfully", response);
  }

  @Operation(summary = "Tạo mới đơn vị đo", description = "API cho phép Admin tạo mới một đơn vị đo tính toán. Tên đơn vị đo phải là duy nhất và không được trùng lặp trong hệ thống.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Tạo đơn vị đo thành công"),
      @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ (ví dụ: tên bị trống hoặc đã tồn tại)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> createUnit(@RequestBody @Valid CreateUnitRequest request) {
    log.info("REST request to create unit: {}", request);
    var response = unitUseCase.createUnit(request);
    log.info("New unit: {}", response);
    return Utils.returnCreatedResponse("Create unit successfully");
  }

  @Operation(summary = "Cập nhật đơn vị đo", description = "API cho phép Admin cập nhật thông tin đơn vị đo. Sau khi cập nhật thành công, hệ thống sẽ gửi thông báo đến phòng KH-KT, chi nhánh Thi công và phòng Kinh doanh.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cập nhật đơn vị đo thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UnitResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn vị đo với ID cung cấp", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "400", description = "Tên mới đã tồn tại ở đơn vị đo khác", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> updateUnit(
      @Parameter(description = "ID của đơn vị đo cần cập nhật", example = "550e8400-e29b-41d4-a716-446655440000") @PathVariable String id,
      @RequestBody @Valid UpdateUnitRequest request) {
    log.info("REST request to update unit id: {}, request: {}", id, request);
    var response = unitUseCase.updateUnit(id, request);
    return Utils.returnOkResponse("Update unit successfully", response);
  }

  @Operation(summary = "Xóa đơn vị đo", description = "API cho phép Admin xóa một đơn vị đo. Điều kiện xóa: đơn vị này chưa từng được sử dụng trong danh mục vật tư. Hệ thống sẽ gửi thông báo cho các phòng ban liên quan sau khi xóa.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Xóa đơn vị đo thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "400", description = "Đơn vị đang được sử dụng bởi vật tư, không thể xóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn vị đo cần xóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> deleteUnit(
      @Parameter(description = "ID của đơn vị đo cần xóa", example = "550e8400-e29b-41d4-a716-446655440000") @PathVariable String id) {
    log.info("REST request to delete unit id: {}", id);
    unitUseCase.deleteUnit(id);
    return Utils.returnOkResponse("Delete unit successfully", null);
  }
}
