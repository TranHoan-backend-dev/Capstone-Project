package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.material.MaterialService;
import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
import com.capstone.device.application.usecase.MaterialUseCase;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Quản lý đơn giá vật tư", description = "Dịch vụ quản lý đơn giá vật tư")
public class MaterialController {
  final MaterialUseCase mUseCase;
  final MaterialService mService;
  Logger log;

  @Operation(summary = "Tạo mới đơn giá vật tư", description = "Cho phép nhân viên IT tạo mới một bản ghi đơn giá vật tư vào hệ thống. Yêu cầu quyền IT_STAFF.", responses = {
      @ApiResponse(responseCode = "201", description = "Tạo mới thành công"),
      @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện thao tác này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createMaterial(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create material: {}", request.jobContent());
    var response = mUseCase.create(request);
    log.info("Response: {}", response);
    return Utils.returnCreatedResponse("Material created successfully");
  }

  @Operation(summary = "Cập nhật đơn giá vật tư", description = "Cập nhật thông tin đơn giá vật tư dựa trên ID. Sau khi cập nhật thành công, một sự kiện sẽ được gửi đến RabbitMQ để thông báo cho Notification Service.", responses = {
      @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = MaterialResponse.class))),
      @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc không tìm thấy ID vật tư tương ứng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateMaterial(
      @PathVariable @Parameter(description = "ID của vật tư cần cập nhật", example = "VL001") String id,
      @RequestBody @Valid UpdateRequest request) {
    log.info("REST request to update material: {}", id);
    var response = mUseCase.update(id, request);
    return Utils.returnOkResponse("Material updated successfully", response);
  }

  @Operation(summary = "Xóa đơn giá vật tư", description = "Xóa bản ghi vật tư khỏi hệ thống dựa trên ID. Thao tác này sẽ kích hoạt sự kiện xóa gửi đến các dịch vụ liên quan.", responses = {
      @ApiResponse(responseCode = "200", description = "Xóa thành công"),
      @ApiResponse(responseCode = "400", description = "Không tìm thấy ID vật tư để xóa", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteMaterial(
      @PathVariable @Parameter(description = "ID của vật tư cần xóa", example = "VL001") String id) {
    log.info("REST request to delete material: {}", id);
    mUseCase.delete(id);
    return Utils.returnOkResponse("Material deleted successfully", null);
  }

  @Operation(summary = "Lấy thông tin vật tư theo ID", description = "Tìm kiếm và trả về thông tin chi tiết của một vật tư dựa trên ID cung cấp.", responses = {
      @ApiResponse(responseCode = "200", description = "Tìm thấy thông tin vật tư", content = @Content(schema = @Schema(implementation = MaterialResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy vật tư với ID tương ứng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getMaterialById(
      @PathVariable @Parameter(description = "ID của vật tư cần lấy thông tin", example = "VL001") String id) {
    log.info("REST request to get material: {}", id);
    var response = mUseCase.get(id);
    return Utils.returnOkResponse("Material retrieved successfully", response);
  }

  @Operation(summary = "Lấy danh sách tất cả vật tư", description = "Trả về danh sách các vật tư trong hệ thống với hỗ trợ phân trang.")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllMaterials(
      @PageableDefault @Parameter(description = "Thông tin phân trang") Pageable pageable) {
    log.info("REST request to get all materials with pagination: {}", pageable);
    var response = mUseCase.getAll(pageable);
    return Utils.returnOkResponse("Materials retrieved successfully", response);
  }

  // internal api, do not expose
  @Operation(hidden = true)
  @GetMapping("/exist")
  public ResponseEntity<?> checkExistence(@RequestParam String id) {
    log.info("REST request to check existence of water meter: {}", id);
    return Utils.returnNoContentResponse("Check material id successfully", mService.materialExists(id));
  }
}
