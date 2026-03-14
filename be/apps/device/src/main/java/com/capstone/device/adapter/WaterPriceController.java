package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import com.capstone.device.application.usecase.WaterPriceUseCase;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@AppLog
@Validated
@RestController
@RequestMapping("/water-prices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Water Price", description = "Quản lý các loại bảng giá nước trong hệ thống")
public class WaterPriceController {
  WaterPriceUseCase useCase;
  @NonFinal
  Logger log;

  @Operation(summary = "Tạo mới một bảng giá nước", description = "Tạo mới một bảng giá tiền nước mới vào hệ thống, bao gồm các thông tin về thuế, phí môi trường và thời gian áp dụng", responses = {
    @ApiResponse(responseCode = "201", description = "Bảng giá nước đã được tạo thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createWaterPrice(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create water price for target: {}", request.usageTarget());
    var response = useCase.createWaterPrice(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo bảng giá nước thành công");
  }

  @Operation(summary = "Cập nhật bảng giá nước", description = "Cập nhật thông tin của một bảng giá nước đã tồn tại dựa trên ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WaterPriceResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ hoặc ID không khớp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bảng giá nước với ID đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateWaterPrice(
    @PathVariable @Parameter(description = "ID của bảng giá nước cần cập nhật") String id,
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update water price: {}", id);
    var response = useCase.updateWaterPrice(id, request);
    return Utils.returnOkResponse("Cập nhật bảng giá nước thành công", response);
  }

  @Operation(summary = "Xóa bảng giá nước", description = "Xóa một bảng giá nước khỏi hệ thống. Lưu ý: Không thể xóa nếu có khách hàng đang áp dụng mức giá này.", responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công"),
    @ApiResponse(responseCode = "400", description = "Không thể xóa do ràng buộc dữ liệu (đang áp dụng cho khách hàng)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bảng giá nước", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteWaterPrice(
    @PathVariable @Parameter(description = "ID của bảng giá nước cần xóa") String id
  ) {
    log.info("REST request to delete water price: {}", id);
    useCase.deleteWaterPrice(id);
    return Utils.returnOkResponse("Xóa bảng giá nước thành công", null);
  }

  @Operation(summary = "Lấy thông tin giá nước theo ID", description = "Truy xuất chi tiết một bảng giá nước cụ thể bằng ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công", content = @Content(schema = @Schema(implementation = WaterPriceResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy bảng giá nước", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterPriceById(
    @PathVariable @Parameter(description = "ID của bảng giá nước cần lấy") String id
  ) {
    log.info("REST request to get water price: {}", id);
    var response = useCase.getWaterPriceById(id);
    return Utils.returnOkResponse("Lấy thông tin giá nước thành công", response);
  }

  @Operation(summary = "Lấy danh sách bảng giá nước", description = "Lấy danh sách các bảng giá nước có phân trang. Có thể lọc theo kỳ áp dụng.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công", content = @Content(schema = @Schema(implementation = WaterPriceResponse.class))),
    @ApiResponse(responseCode = "400", description = "Tham số yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterPrices(
    @PageableDefault Pageable pageable,
    @RequestParam(value = "applicationPeriod", required = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Parameter(description = "Kỳ áp dụng (YYYY-MM-DD) dùng để lọc")
    @Valid LocalDate applicationPeriod
  ) {
    log.info("REST request to get all water prices with pagination: {}", pageable);
    var response = useCase.getPricesList(pageable, applicationPeriod);
    return Utils.returnOkResponse("Lấy danh sách bảng giá nước thành công", response);
  }
}
