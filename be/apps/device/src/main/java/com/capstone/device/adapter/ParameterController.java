package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.application.usecase.ParameterUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    @Parameter(description = "Thông tin phân trang (page, size, sort)")
    @PageableDefault Pageable pageable,
    @Parameter(description = "Từ khóa tìm kiếm")
    @RequestParam(required = false) String filter
  ) {
    log.info("REST request to get paginated list of params: {}, filter: {}", pageable, filter);
    var response = parameterUseCase.getParametersList(pageable, filter);
    return Utils.returnOkResponse("Get paginated list of params successfully", response);
  }
}
