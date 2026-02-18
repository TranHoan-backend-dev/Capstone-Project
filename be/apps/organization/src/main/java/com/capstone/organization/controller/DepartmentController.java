package com.capstone.organization.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.dto.response.DepartmentResponse;
import com.capstone.organization.service.boundary.DepartmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@AppLog
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/departments")
@PreAuthorize("hasAuthority('IT_STAFF')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Department", description = "Các endpoint quản lý phòng ban")
public class DepartmentController {
  DepartmentService departmentService;
  @NonFinal
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo phòng ban", description = "Tạo một phòng ban mới và trả về dữ liệu của nó.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Tạo phòng ban thành công"),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> createDepartment(
    @RequestBody @Valid CreateDepartmentRequest request) {
    log.info("Create department request comes to endpoint: {}", request);
    var response = departmentService.createDepartment(request);
    return Utils.returnOkResponse(
      "Create department successfully",
      response);
  }

  @PutMapping("/{departmentId}")
  @Operation(summary = "Cập nhật phòng ban", description = "Cập nhật một phòng ban hiện có bằng ID của nó.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật phòng ban thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy phòng ban", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateDepartment(
    @Parameter(in = ParameterIn.PATH, description = "ID phòng ban", required = true, schema = @Schema(type = "string"))
    @PathVariable @NotBlank String departmentId,
    @RequestBody @Valid UpdateDepartmentRequest request) {
    log.info("Update department request comes to endpoint: {}", departmentId);
    var response = departmentService.updateDepartment(departmentId, request);
    return Utils.returnOkResponse("Update department successfully", response);
  }

  // TODO: swagger doc, unit test
  @GetMapping
  @Operation(summary = "Liệt kê phòng ban", description = "Lấy danh sách phân trang các phòng ban.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Lấy danh sách phòng ban thành công", content = @Content(schema = @Schema(implementation = DepartmentResponse.class))),
    @ApiResponse(responseCode = "400", description = "Tham số phân trang không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getDepartments(
    Pageable pageable,
    @RequestParam(required = false) String keyword
  ) {
    var response = departmentService.getDepartments(pageable, keyword);
    return Utils.returnOkResponse("Get departments successfully", response);
  }

  @GetMapping("/exist/{id}")
  public Boolean checkExistence(@PathVariable("id") String departmentId) {
    log.info("Check existence of department {}", departmentId);
    var response = departmentService.checkIfDepartmentExists(departmentId);
    log.info("Department is {}", response ? "existing" : "not existing");
    return response;
  }
}
