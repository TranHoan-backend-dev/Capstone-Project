package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.usecase.InstallationFormHandlingUseCase;
import com.capstone.construction.infrastructure.config.Constant;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/installation-forms")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Installation Form", description = "Endpoints for managing installation forms")
public class InstallationFormController {
  InstallationFormHandlingUseCase installationFormHandlingUseCase;
  @NonFinal
  Logger log;

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = "Form created successfully"),
    @ApiResponse(responseCode = "409", description = "Form already exists", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createInstallationForm(@RequestBody @Valid NewOrderRequest request) {
    log.info("Received request to create installation form: {}", request.formNumber());
    if (!Utils.isLocalDate(request.receivedFormAt(), DateTimeFormatter.ISO_LOCAL_DATE) ||
      !Utils.isLocalDate(request.citizenIdentificationProvideDate(), DateTimeFormatter.ISO_LOCAL_DATE) ||
      !Utils.isLocalDate(request.scheduleSurveyAt(), DateTimeFormatter.ISO_LOCAL_DATE)) {
      throw new IllegalArgumentException(Constant.PT_05);
    }

    var response = installationFormHandlingUseCase.createNewInstallationRequest(request);

    log.info("Successfully created installation form: {}", response.formNumber());

    return Utils.returnCreatedResponse("Installation form created successfully");
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

    return Utils.returnOkResponse("Installation forms retrieved successfully",response);
  }
}
