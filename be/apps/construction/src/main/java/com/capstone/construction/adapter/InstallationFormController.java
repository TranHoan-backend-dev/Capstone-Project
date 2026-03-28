package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.request.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.usecase.InstallationFormUseCase;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.utils.Message;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@AppLog
@RestController
@RequestMapping("/installation-forms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Installation Form", description = "Quản lý đơn lắp đặt (Tiếp nhận và xử lý hồ sơ lắp đặt nước)")
public class InstallationFormController {
  InstallationFormUseCase installationFormHandlingUseCase;
  InstallationFormService installationFormService;
  @NonFinal
  Logger log;

  @Operation(summary = "Tạo mới đơn lắp đặt", description = """
    API này cho phép nhân viên tiếp nhận hồ sơ tạo mới một đơn yêu cầu lắp đặt nước. <br/>
    Hồ sơ bao gồm thông tin khách hàng, mục đích sử dụng và các thông tin liên quan khác.
    Sau khi đơn được tạo thành công, hệ thống sẽ gửi thông báo cho trường phòng KH-KT tại cổng /technical/head,
    đồng thời hệ thống cũng gửi sự kiện tại cổng /create-new-order để tự động cập nhật danh sách
    """, responses = {
    @ApiResponse(responseCode = "201", description = "Tạo đơn lắp đặt thành công"),
    @ApiResponse(responseCode = "409", description = "Lỗi xung đột: Số hồ sơ hoặc mã biểu mẫu đã tồn tại trong hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu: Định dạng ngày không hợp lệ hoặc thiếu thông tin bắt buộc", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAnyAuthority('ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createInstallationForm(
    @RequestBody @Valid NewOrderRequest request,
    @AuthenticationPrincipal Jwt jwt
  ) {
    log.info("Received request to create installation form: {}", request.formNumber());
    var id = jwt.getSubject();

    if (!Utils.isLocalDate(request.receivedFormAt(), DateTimeFormatter.ISO_LOCAL_DATE) ||
      !Utils.isLocalDate(request.citizenIdentificationProvideDate(), DateTimeFormatter.ISO_LOCAL_DATE) ||
      !Utils.isLocalDate(request.scheduleSurveyAt(), DateTimeFormatter.ISO_LOCAL_DATE)) {
      throw new IllegalArgumentException(Message.PT_05);
    }

    var response = installationFormHandlingUseCase.createNewInstallationRequest(id, request);
    log.info("Successfully created installation form: {}", response.formNumber());

    return Utils.returnCreatedResponse("Tạo đơn lắp đặt thành công");
  }

  @Operation(summary = "Phê duyệt hoặc từ chối đơn lắp đặt", description = """
    API này cho phép cấp nhân viên khảo sát thực hiện phê duyệt hoặc từ chối một đơn yêu cầu lắp đặt nước.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Thay đổi trạng thái thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn lắp đặt với mã hồ sơ/biểu mẫu đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Token không hợp lệ hoặc hết hạn", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PatchMapping("/approve")
  @PreAuthorize("hasAnyAuthority('SURVEY_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> reviewInstallationForm(
    @AuthenticationPrincipal Jwt jwt,
    @RequestBody @Valid ApproveRequest request
  ) {
    log.info("Received request to approve installation form: {}", request.formCode());

    var id = jwt.getSubject();
    installationFormHandlingUseCase.reviewInstallationForm(id, request);
    return Utils.returnOkResponse("Thay đổi trạng thái thành công", null);
  }

  @Operation(summary = "Giao xử lý đơn lắp đặt", description = """
    API này cho phép Trưởng phòng KH-KT giao việc xử lý một đơn yêu cầu lắp đặt nước cho 1 nhân viên khảo sát. <br/>
    Nhân viên khảo sát nhận sự kiện thông báo ở cổng socket: /technical/survey-staff
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Giao việc thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn lắp đặt với mã hồ sơ/biểu mẫu đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Token không hợp lệ hoặc hết hạn", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PatchMapping("/assign/{empId}")
  @PreAuthorize("hasAnyAuthority('PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> assignInstallationForm(
    @RequestBody @Valid InstallationFormId request,
    @PathVariable String empId
  ) {
    log.info("Received request to assign installation form: {}", request.getFormCode());
    installationFormHandlingUseCase.assignInstallationFormToSurveyStaff(request, empId);
    return Utils.returnOkResponse("Thay đổi trạng thái thành công", null);
  }

  @Operation(summary = "Lấy danh sách đơn lắp đặt (có phân trang & lọc)", description = "API này cho phép lấy danh sách các đơn lắp đặt nước. Hỗ trợ phân trang và lọc theo từ khóa (tên khách hàng, địa chỉ) hoặc khoảng thời gian.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công. Trả về danh sách đơn lắp đặt.", content = @Content(schema = @Schema(implementation = InstallationFormListResponse.class))),
    @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu đầu vào (VD: định dạng ngày sai, ngày bắt đầu lớn hơn ngày kết thúc).", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống.", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  @PreAuthorize("hasAnyAuthority('PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', 'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP')")
  public ResponseEntity<WrapperApiResponse> getInstallationForms(
    @Parameter(description = "Thông tin phân trang (page, size, sort)", schema = @Schema(implementation = Pageable.class)) Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request
  ) {
    log.info("Received request to fetch grouped installation forms");

    if (request.from() != null && request.to() != null) {
      LocalDate from = LocalDate.parse(request.from());
      LocalDate to = LocalDate.parse(request.to());

      if (from.isAfter(to)) {
        throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
      }
    }

    var response = installationFormHandlingUseCase.getPaginatedInstallationForms(pageable, request);
    log.info("Successfully fetched installation forms");

    return Utils.returnOkResponse("Lấy danh sách đơn lắp đặt thành công", response);
  }

  @Operation(summary = "Lấy danh sách đơn chờ duyệt dự toán", description = "Lấy các đơn lắp đặt có trạng thái của estimate là PENDING_FOR_APPROVAL")
  @GetMapping("/estimate/pending")
  @PreAuthorize("hasAnyAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getPendingEstimateForms(Pageable pageable) {
    var response = installationFormHandlingUseCase.findByEstimateStatusPending(pageable);
    return Utils.returnOkResponse("Lấy danh sách thành công", response);
  }

  @Operation(summary = "Lấy danh sách đơn chờ duyệt khảo sát", description = "Lấy các đơn lắp đặt mới có trạng thái registration là PENDING_FOR_APPROVAL")
  @GetMapping("/registration/pending")
  @PreAuthorize("hasAnyAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getPendingRegistrationForms(Pageable pageable) {
    var response = installationFormHandlingUseCase.findByRegistrationStatusPending(pageable);
    return Utils.returnOkResponse("Lấy danh sách thành công", response);
  }

  @Operation(summary = "Lấy danh sách đơn đã duyệt dự toán", description = "Lấy các đơn lắp đặt mới có trạng thái estimate là APPROVED và REJECTED (Tách riêng)")
  @GetMapping("/reviewed")
  @PreAuthorize("hasAnyAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getReviewedEstimateForms() {
    var response = installationFormHandlingUseCase.getReviewedInstallationFormsList();
    return Utils.returnOkResponse("Lấy danh sách thành công", response);
  }

  @Operation(summary = "Lấy danh sách đơn đã giao khảo sát", description = "Lấy các đơn lắp đặt mới đã được giao cho nhân viên khảo sát")
  @GetMapping("/assigned")
  @PreAuthorize("hasAnyAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getAssignedForms(Pageable pageable) {
    var response = installationFormHandlingUseCase.findByHandoverByIsNotNull(pageable);
    return Utils.returnOkResponse("Lấy danh sách thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/exist")
  public boolean isExisting(
    @RequestParam String formCode,
    @RequestParam String formNumber
  ) {
    return installationFormService.isInstallationFormExisting(formNumber, formCode);
  }

  @Operation(summary = "Cập nhật trạng thái hợp đồng", description = "API này cập nhật trạng thái hợp đồng cho đơn lắp đặt", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật trạng thái hợp đồng thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn lắp đặt", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/contract-status")
  @PatchMapping("/contract-status")
  @PreAuthorize("hasAnyAuthority('INSTALLATION_FORM_MANAGER', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateContractStatus(
    @RequestParam String formCode,
    @RequestParam String formNumber
  ) {
    log.info("Updating contract status for formCode: {} and formNumber: {}", formCode, formNumber);
    installationFormService.updateContractStatus(formCode, formNumber);
    return Utils.returnOkResponse("Cập nhật trạng thái hợp đồng thành công", null);
  }
}
