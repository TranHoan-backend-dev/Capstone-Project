package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.application.usecase.ParameterUseCase;
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
@RequestMapping("/params")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Tham số hệ thống", description = "API quản lý các tham số cấu hình hệ thống")
public class ParameterController {
  @NonFinal
  Logger log;

  ParameterUseCase parameterUseCase;

  @Operation(summary = "Lấy danh sách tham số phân trang", description = "API cho phép lấy danh sách các tham số hệ thống có hỗ trợ phân trang và tìm kiếm theo từ khóa")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Thành công. Trả về danh sách tham số phân trang.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParameterResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi hệ thống nội bộ.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<?> getPaginatedParameters(
      @Parameter(description = "Thông tin phân trang (page, size, sort)") @PageableDefault Pageable pageable,
      @Parameter(description = "Từ khóa tìm kiếm") @RequestParam(required = false) String filter) {
    log.info("REST request to get paginated list of params: {}, filter: {}", pageable, filter);
    var response = parameterUseCase.getParametersList(pageable, filter);
    return Utils.returnOkResponse("Lấy danh sách tham số thành công", response);
  }

  @Operation(summary = "Cập nhật tham số hệ thống", description = "API cho phép Admin cập nhật giá trị tham số cấu hình. Hệ thống sẽ gửi thông báo cho phòng KH-KT và chi nhánh Thi công.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParameterResponse.class))),
      @ApiResponse(responseCode = "404", description = "Không tìm thấy tham số", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> updateParameter(
      @PathVariable String id,
      @RequestBody @Valid UpdateParameterRequest request) {
    log.info("REST request to update parameter id: {}, request: {}", id, request);
    var response = parameterUseCase.updateParameter(id, request);
    return Utils.returnOkResponse("Cập nhật tham số thành công", response);
  }
}
