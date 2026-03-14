package com.capstone.organization.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.organization.dto.request.job.CreateJobRequest;
import com.capstone.organization.dto.request.job.UpdateJobRequest;
import com.capstone.organization.dto.request.job.FilterJobRequest;
import com.capstone.organization.service.boundary.JobService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
@RequestMapping("/jobs")
@PreAuthorize("hasAuthority('IT_STAFF')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Job", description = "Các endpoint quản lý chức danh công việc")
public class JobController {
  JobService jobService;

  @NonFinal
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo chức danh công việc", description = "Tạo một chức danh công việc mới và trả về dữ liệu của nó.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Tạo chức danh công việc thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> createJob(
    @RequestBody @Valid CreateJobRequest request) {
    log.info("Create job request comes to endpoint: {}", request);
    var response = jobService.createJob(request);
    return Utils.returnOkResponse("Tạo công việc thành công", response);
  }

  @PutMapping("/{jobId}")
  @Operation(summary = "Cập nhật công việc", description = "Cập nhật công việc hiện có bằng ID của nó.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật công việc thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy công việc", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateJob(
    @Parameter(in = ParameterIn.PATH, description = "ID công việc", required = true, schema = @Schema(type = "string"))
    @PathVariable @NotBlank String jobId,
    @RequestBody @Valid UpdateJobRequest request) {
    log.info("Update job request comes to endpoint: {}", jobId);
    var response = jobService.updateJob(jobId, request);
    return Utils.returnOkResponse("Cập nhật công việc thành công", response);
  }

  @GetMapping
  @Operation(summary = "Liệt kê công việc", description = "Lấy danh sách phân trang các công việc với hỗ trợ tìm kiếm và lọc.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Lấy danh sách công việc thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Tham số yêu cầu không hợp lệ", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> getJobs(
    @ParameterObject Pageable pageable,
    @ParameterObject FilterJobRequest filter) {
    var response = jobService.getJobs(pageable, filter);
    return Utils.returnOkResponse("Lấy danh sách công việc thành công", response);
  }

  @DeleteMapping("/{jobId}")
  @Operation(summary = "Xóa công việc", description = "Xóa một công việc nếu không còn nhân viên nào đảm nhiệm.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Xóa công việc thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Không thể xóa do ràng buộc dữ liệu hoặc lỗi nghiệp vụ", content = @Content),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy công việc", content = @Content),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> deleteJob(@PathVariable String jobId) {
    log.info("Delete job request for id: {}", jobId);
    jobService.deleteJob(jobId);
    return Utils.returnOkResponse("Xóa công việc thành công", null);
  }

  @GetMapping("/exist/{id}")
  public Boolean checkExistence(@PathVariable String id) {
    log.info("Check existence of id: {}", id);
    var response = jobService.checkExistence(id);
    log.info("Job is {}", response ? "exist" : "not exist");
    return response;
  }
}
