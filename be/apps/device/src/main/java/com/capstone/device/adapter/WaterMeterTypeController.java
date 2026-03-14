package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.application.dto.response.WaterMeterTypeResponse;
import com.capstone.device.application.usecase.MeterTypeUseCase;
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
@RequestMapping("/meter-types")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Quản lý Loại đồng hồ", description = "Các API quản lý danh mục Loại đồng hồ nước")
public class WaterMeterTypeController {
  MeterTypeUseCase mtUseCase;
  @NonFinal
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo mới loại đồng hồ", description = """
      **Luồng nghiệp vụ:**
      1. Client gửi request chứa thông tin tạo mới loại đồng hồ.
      2. Hệ thống validate DTO đầu vào.
      3. Hệ thống kiểm tra quyền truy cập (Yêu cầu quyền 'IT_STAFF').
      4. Gọi UseCase để xử lý logic lưu trữ dữ liệu.
      5. Trả về response thành công hoặc lỗi tương ứng.
      """, responses = {
      @ApiResponse(responseCode = "201", description = "Tạo mới loại đồng hồ thành công"),
      @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createType(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create water meter type: {}", request.name());
    var response = mtUseCase.createMeterType(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo chủng loại đồng hồ thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật loại đồng hồ", description = "Cập nhật thông tin chi tiết của loại đồng hồ hiện có", parameters = {
      @Parameter(name = "id", description = "ID của loại đồng hồ cần cập nhật", required = true)
  }, responses = {
      @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WaterMeterTypeResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy loại đồng hồ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateType(
      @PathVariable @Parameter(description = "ID của loại đồng hồ cần cập nhật") String id,
      @RequestBody @Valid UpdateRequest request) {
    log.info("REST request to update water meter type: {}", id);
    var response = mtUseCase.updateMeterType(id, request);
    return Utils.returnOkResponse("Cập nhật chủng loại đồng hồ thành công", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa loại đồng hồ", description = "Xóa bản ghi loại đồng hồ khỏi hệ thống", parameters = {
      @Parameter(name = "id", description = "ID của loại đồng hồ cần xóa", required = true)
  }, responses = {
      @ApiResponse(responseCode = "200", description = "Xóa thành công"),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy loại đồng hồ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteType(
      @PathVariable @Parameter(description = "ID của loại đồng hồ cần xóa") String id) {
    log.info("REST request to delete water meter type: {}", id);
    mtUseCase.deleteMeterType(id);
    return Utils.returnOkResponse("Xóa chủng loại đồng hồ thành công", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy thông tin chi tiết loại đồng hồ", description = "Truy xuất thông tin chi tiết của một loại đồng hồ theo ID", responses = {
      @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = WaterMeterTypeResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy loại đồng hồ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getTypeById(
      @PathVariable @Parameter(description = "ID của loại đồng hồ cần lấy thông tin") String id) {
    log.info("REST request to get water meter type: {}", id);
    var response = mtUseCase.getMeterTypeById(id);
    return Utils.returnOkResponse("Lấy thông tin chủng loại đồng hồ thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách loại đồng hồ", description = "Lấy danh sách tất cả các loại đồng hồ có phân trang")
  public ResponseEntity<WrapperApiResponse> getAllTypes(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water meter types");
    var response = mtUseCase.getAllMeterTypes(pageable);
    return Utils.returnOkResponse("Lấy danh sách chủng loại đồng hồ thành công", response);
  }
}
