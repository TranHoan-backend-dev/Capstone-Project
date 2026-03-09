package com.capstone.construction.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.usecase.InstallationFormHandlingUseCase;
import com.capstone.construction.infrastructure.utils.Constant;
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
@Tag(name = "Installation Form", description = "Quản lý đơn lắp đặt (Tiếp nhận và xử lý hồ sơ lắp đặt nước)")
public class InstallationFormController {
  InstallationFormHandlingUseCase installationFormHandlingUseCase;
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

  @Operation(summary = "Phê duyệt hoặc từ chối đơn lắp đặt", description = """
    API này cho phép cấp quản lý (Trưởng phòng KH-KT) thực hiện phê duyệt hoặc từ chối một đơn yêu cầu lắp đặt nước. <br/>
    Nếu được phê duyệt (status=true), hệ thống sẽ gửi một sự kiện (event) để thông báo cho nhân viên khảo sát/thi công bắt đầu quy trình tiếp theo.

    Nhân viên khảo sát nhận sự kiện thông báo ở cổng socket: /technical/survey-staff
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Thay đổi trạng thái thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn lắp đặt với mã hồ sơ/biểu mẫu đã cung cấp", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Token không hợp lệ hoặc hết hạn", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PatchMapping("/approve")
  @PreAuthorize("hasAnyAuthority('PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> approveInstallationForm(@RequestBody @Valid ApproveRequest request) {
    log.info("Received request to approve installation form: {}", request.formCode());
    installationFormHandlingUseCase.approveInstallationForm(request);
    return Utils.returnOkResponse("Change status successfully", null);
  }

  @Operation(summary = "Lấy danh sách đơn lắp đặt (có phân trang & lọc)", description = "API này cho phép lấy danh sách các đơn lắp đặt nước. Hỗ trợ phân trang và lọc theo từ khóa (tên khách hàng, địa chỉ) hoặc khoảng thời gian.", responses = {
    @ApiResponse(responseCode = "200", description = "Thành công. Trả về danh sách đơn lắp đặt.", content = @Content(schema = @Schema(implementation = InstallationFormListResponse.class))),
    @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu đầu vào (VD: định dạng ngày sai, ngày bắt đầu lớn hơn ngày kết thúc).", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống.", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  @PreAuthorize("hasAnyAuthority('PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getInstallationForms(
    @Parameter(description = "Thông tin phân trang (page, size, sort)", schema = @Schema(implementation = Pageable.class)) Pageable pageable,

    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request) {
    log.info("Received request to fetch grouped installation forms");

    if (request.from() != null && request.to() != null) {
      LocalDate from = LocalDate.parse(request.from());
      LocalDate to = LocalDate.parse(request.to());

      if (from.isAfter(to)) {
        throw new IllegalArgumentException("From date must be before to date");
      }
    }

    var response = installationFormHandlingUseCase.getPaginatedInstallationForms(pageable, request);

    return Utils.returnOkResponse("Installation forms retrieved successfully", response);
  }

  // <editor-fold> desc="đơn chờ thi công"
  @Operation(summary = "Lấy danh sách đơn lắp đặt chờ thi công", description = """
    API này cho phép nhân viên tiếp nhận hồ sơ lấy danh sách các đơn yêu cầu lắp đặt nước đã được duyệt và đang ở trạng thái chờ thi công. <br/>
    Hỗ trợ phân trang và lọc theo từ khóa hoặc khoảng thời gian.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Định dạng ngày không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/construction")
  @PreAuthorize("hasAuthority('ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> getConstructionOrdersList(
    @Parameter(description = "Thông tin phân trang (page, size, sort)") Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, khoảng thời gian)") BaseFilterRequest request) {
    log.info("Received request to fetch construction orders list");
    var response = installationFormHandlingUseCase.getPaginatedConstructionRequest(pageable, request);
    return Utils.returnOkResponse("Get construction requests list successfully", response);
  }
  // </editor-fold>

}
