package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.usecase.catalog.WaterSupplyNetworkUseCase;
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
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/networks")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Water Supply Network", description = "Quản lý danh mục mạng lưới cấp nước. Cung cấp các API để tạo, cập nhật, xóa và truy vấn thông tin mạng lưới.")
public class WaterSupplyNetworkController {
  WaterSupplyNetworkUseCase networkUseCase;
  @NonFinal
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo mới mạng lưới cấp nước", description = "Khởi tạo một bản ghi mạng lưới cấp nước mới. Tên mạng lưới phải là duy nhất trong hệ thống.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo mới thành công", content = @Content(schema = @Schema(implementation = WaterSupplyNetworkResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu quyền IT_STAFF)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "409", description = "Mạng lưới với tên này đã tồn tại", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createNetwork(
    @Parameter(description = "Thông tin tạo mới mạng lưới", required = true, schema = @Schema(implementation = CreateRequest.class)) @RequestBody @Valid CreateRequest request) {
    log.info("REST request to create network: {}", request.name());
    networkUseCase.createNetwork(request);
    return Utils.returnCreatedResponse("Tạo chi nhánh cấp nước thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật thông tin mạng lưới", description = "Cập nhật dữ liệu của một mạng lưới cấp nước đã tồn tại dựa trên ID. Chỉ cho phép cập nhật tên mạng lưới.", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WaterSupplyNetworkResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu yêu cầu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy mạng lưới", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateNetwork(
    @PathVariable @Parameter(description = "ID của mạng lưới cấp nước", required = true) String id,
    @RequestBody @Valid UpdateRequest request) {
    log.info("REST request to update network: {}", id);
    var response = networkUseCase.updateNetwork(id, request);
    return Utils.returnOkResponse("Cập nhật chi nhánh cấp nước thành công", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa mạng lưới cấp nước", description = "Xóa một mạng lưới cấp nước khỏi hệ thống theo ID. Lưu ý: Thao tác này có thể bị từ chối nếu mạng lưới đang được sử dụng trong các nghiệp vụ khác.", responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy mạng lưới", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteNetwork(
    @PathVariable @Parameter(description = "ID của mạng lưới cấp nước", required = true) String id) {
    log.info("REST request to delete network: {}", id);
    networkUseCase.deleteNetwork(id);
    return Utils.returnOkResponse("Xóa chi nhánh cấp nước thành công", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy chi tiết mạng lưới", description = "Lấy thông tin chi tiết của một mạng lưới cấp nước cụ thể theo ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = WaterSupplyNetworkResponse.class))),
    @ApiResponse(description = "Không tìm thấy mạng lưới", responseCode = "404", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(description = "Lỗi hệ thống nội bộ", responseCode = "500", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getNetworkById(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to get network: {}", id);
    var response = networkUseCase.getNetworkById(id);
    return Utils.returnOkResponse("Lấy thông tin chi nhánh thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách mạng lưới cấp nước", description = "Lấy danh sách các mạng lưới cấp nước trong hệ thống, có hỗ trợ phân trang và tìm kiếm theo từ khóa.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = WaterSupplyNetworkResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllNetworks(
    @PageableDefault @Parameter(description = "Tham số phân trang (page, size, sort)") Pageable pageable,
    @RequestParam(required = false) @Parameter(description = "Từ khóa tìm kiếm theo tên mạng lưới") String keyword) {
    log.info("REST request to get all networks with pagination: {}", pageable);
    var response = networkUseCase.getAllNetworks(pageable, keyword);
    return Utils.returnOkResponse("Lấy danh sách mạng lưới thành công", response);
  }

  // internal api, do not expose
  @Operation(hidden = true)
  @GetMapping("/exist/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public Boolean checkExistence(@PathVariable String id) {
    log.info("REST request to check existence: {}", id);
    return networkUseCase.checkExistenceOfNetwork(id);
  }
}
