package com.capstone.construction.adapter;

import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.InstallationFormResponse;
import com.capstone.construction.application.usecase.InstallationFormHandlingUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/installation-forms")
@RequiredArgsConstructor
@Tag(name = "Installation Form", description = "Endpoints for managing installation forms")
public class InstallationFormController {
  private final InstallationFormHandlingUseCase installationFormHandlingUseCase;

  @Operation(summary = "Create a new installation form", description = "Initializes a new installation request and triggers notification event", responses = {
    @ApiResponse(responseCode = "201", description = "Form created successfully", content = @Content(schema = @Schema(implementation = InstallationFormResponse.class))),
    @ApiResponse(responseCode = "409", description = "Form already exists", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAnyAuthority('SURVEY_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createInstallationForm(@RequestBody @Valid NewOrderRequest request) {
    log.info("Received request to create installation form: {}", request.formNumber());

    var response = installationFormHandlingUseCase.createNewInstallationRequest(request);

    log.info("Successfully created installation form: {}", response.formNumber());

    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      "Installation form created successfully",
      response,
      LocalDateTime.now()));
  }

  @Operation(summary = "Lấy danh sách đơn lắp đặt (có phân trang & lọc)", description = "API này cho phép lấy danh sách các đơn lắp đặt nước. Hỗ trợ phân trang và lọc theo từ khóa (tên khách hàng, địa chỉ) hoặc khoảng thời gian.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công. Trả về danh sách đơn lắp đặt.", content = @Content(schema = @Schema(implementation = InstallationFormListResponse.class))),
    @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu đầu vào (VD: định dạng ngày sai, ngày bắt đầu lớn hơn ngày kết thúc).", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống.", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  @PreAuthorize("hasAnyAuthority('PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getInstallationForms(
    @Parameter(description = "Thông tin phân trang (page, size, sort)", schema = @Schema(implementation = Pageable.class))
    Pageable pageable,

    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)")
    FilterFormRequest request) {
    log.info("Received request to fetch grouped installation forms");

    if (request.from() != null && request.to() != null) {
      LocalDate from = LocalDate.parse(request.from());
      LocalDate to = LocalDate.parse(request.to());

      if (from.isAfter(to)) {
        throw new IllegalArgumentException("From date must be before to date");
      }
    }

    var response = installationFormHandlingUseCase.getPaginatedInstallationForms(pageable, request);

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Installation forms retrieved successfully",
      response);
  }
}
