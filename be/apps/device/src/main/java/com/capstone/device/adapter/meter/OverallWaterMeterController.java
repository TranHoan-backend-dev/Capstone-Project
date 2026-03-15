package com.capstone.device.adapter.meter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.usecase.WaterMeterUseCase;
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
@RequestMapping("/water-meters/overall")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Đồng hồ tổng", description = "Quản lý đồng hồ tổng")
public class OverallWaterMeterController {
  WaterMeterService waterMeterService;
  WaterMeterUseCase waterMeterUseCase;
  @NonFinal
  Logger log;

  @Operation(
    summary = "Xóa đồng hồ tổng theo Lateral ID",
    description = "Thực hiện xóa bản ghi đồng hồ tổng dựa trên mã Lateral ID được cung cấp. Yêu cầu quyền IT_STAFF.",
    responses = {
      @ApiResponse(responseCode = "200", description = "Xóa thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ")
    }
  )
  @DeleteMapping("/lateral")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteByLateral(
      @Parameter(description = "ID của nhánh (Lateral) cần xóa đồng hồ tổng", required = true)
      @RequestParam String id) {
    log.info("REST request to delete water meter by lateral: {}", id);
    waterMeterUseCase.deleteOverallWaterMeterByLateralId(id);
    return Utils.returnOkResponse("Xóa đồng hồ tổng thành công", null);
  }

  @Operation(
    summary = "Lấy danh sách đồng hồ tổng (Tìm kiếm & Phân trang)",
    description = "Truy xuất danh sách các đồng hồ tổng, hỗ trợ tìm kiếm mờ theo tên và phân trang dữ liệu. Yêu cầu quyền IT_STAFF.",
    responses = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ")
    }
  )
  @GetMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getAll(
      @Parameter(description = "Tham số phân trang (trang, kích thước, sắp xếp)")
      Pageable pageable,
      @Parameter(description = "Từ khóa tìm kiếm theo tên đồng hồ")
      @RequestParam(required = false) String keyword
  ) {
    log.info("REST request to get all overall water meter with keyword: {}", keyword);
    var response = waterMeterUseCase.getAllOverallWaterMeters(pageable, keyword);
    return Utils.returnOkResponse("Lấy danh sách đồng hồ tổng thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/{id}/exists")
  public ResponseEntity<WrapperApiResponse> checkOverallWaterMeterExisting(
      @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to check existence of overall water meter: {}", id);
    var response = waterMeterService.isOverallWaterMeterExisting(id);
    log.info("Meter is existed? {}", response);
    return Utils.returnOkResponse("Kiểm tra sự tồn tại của đồng hồ nước thành công", response);
  }
}
