package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.hamlet.CreateHamletRequest;
import com.capstone.construction.application.dto.request.hamlet.UpdateHamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.usecase.catalog.HamletUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/hamlets")
@RequiredArgsConstructor
@Tag(name = "Thôn/Làng", description = "Quản lý thôn/làng – đơn vị hành chính thuộc cấp xã")
public class HamletController {
  private final HamletUseCase hamletUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo thôn/làng", description = "Tạo mới một thôn/làng thuộc một xã", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "409", description = "Tên thôn/làng đã tồn tại", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createHamlet(@RequestBody @Valid CreateHamletRequest request) {
    log.info("REST request to create hamlet: {}", request.name());
    var response = hamletUseCase.createHamlet(request);
    log.info("Created hamlet: {}", response.name());
    return Utils.returnCreatedResponse("Hamlet created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật thôn/làng", description = "Cập nhật thông tin thôn/làng", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = HamletResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thôn/làng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "409", description = "Tên đã tồn tại", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateHamlet(
    @PathVariable @Parameter(description = "ID thôn/làng", in = ParameterIn.PATH, required = true) String id,
    @RequestBody @Valid UpdateHamletRequest request) {
    log.info("REST request to update hamlet: {}", id);
    var response = hamletUseCase.updateHamlet(id, request);
    return Utils.returnOkResponse("Hamlet updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xoá thôn/làng", description = "Xoá thôn/làng theo ID", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "400", description = "ID không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thôn/làng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteHamlet(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to delete hamlet: {}", id);
    hamletUseCase.deleteHamlet(id);
    return Utils.returnOkResponse("Hamlet deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = HamletResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getHamletById(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to get hamlet: {}", id);
    var response = hamletUseCase.getHamletById(id);
    return Utils.returnOkResponse("Hamlet retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = HamletResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllHamlets(
    @PageableDefault @Parameter(description = "") Pageable pageable) {
    log.info("REST request to get all hamlets");
    var response = hamletUseCase.getAllHamlets(pageable);
    return Utils.returnOkResponse("Hamlets retrieved successfully", response);
  }
}
