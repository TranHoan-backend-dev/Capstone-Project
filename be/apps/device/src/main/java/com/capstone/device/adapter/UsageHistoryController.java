package com.capstone.device.adapter;

import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.history.AnalysisRequest;
import com.capstone.device.application.dto.request.history.UsageHistoryRequest;
import com.capstone.device.application.usecase.UsageHistoryUseCase;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.Collection;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/usage")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Tag(name = "Lịch sử sử dụng nước", description = "Các API quản lý lịch sử ghi nước và thanh toán tiền nước của khách hàng")
public class UsageHistoryController {
  UsageHistoryUseCase useCase;

  @Operation(summary = "Cập nhật chỉ số nước tháng này", description = "Ghi nhận chỉ số nước mới từ hình ảnh đồng hồ cho thiết bị theo mã Serial")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc chỉ số mới thấp hơn kỳ trước"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thiết bị")
  })
  @PostMapping(value = "/{serial}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateWaterIndexThisMonth(
    @Parameter(description = "Mã Serial của thiết bị", example = "WM-2024-001") @PathVariable String serial,
    @RequestBody @Valid UsageHistoryRequest request
  ) {
    log.info("Updating usage history for serial {}", serial);
    var response = useCase.updateWaterIndex(request, serial);
    return Utils.returnOkResponse("Cập nhật chỉ số nước thành công", response);
  }

  @Operation(summary = "Phân tích ảnh chụp đồng hồ với AI. Yêu cầu cần có số serial")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc chỉ số mới thấp hơn kỳ trước"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thiết bị")
  })
  @PostMapping(value = "/analyze/{serial}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> analysisTheMeterImageWithSerial(
    @Parameter(description = "Mã Serial của thiết bị", example = "WM-2024-001") @PathVariable String serial,
    @ModelAttribute @Valid AnalysisRequest request
  ) {
    log.info("Analysis the meter image with serial {}", serial);
    var response = useCase.analysisTheMeterImageWithSerial(request, serial);
    log.info("[analysisTheMeterImageWithSerial] Result {}", response);
    return Utils.returnOkResponse("Phân tích thành công", response);
  }

  @Operation(summary = "Phân tích ảnh chụp đồng hồ với AI. Không cần có số serial")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc chỉ số mới thấp hơn kỳ trước"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thiết bị")
  })
  @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> analysisTheMeterImageWithoutSerial(
    @ModelAttribute @Valid AnalysisRequest request
  ) {
    log.info("Analysis the meter image without serial");
    var response = useCase.analysisTheMeterImageWithSerial(request, null);
    log.info("[analysisTheMeterImageWithoutSerial] Result {}", response);
    return Utils.returnOkResponse("Phân tích thành công", response);
  }

  @Operation(summary = "Cập nhật trạng thái thanh toán", description = "Đánh dấu là đã thanh toán cho bản ghi có ngày đo mới nhất của thiết bị")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật trạng thái thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lịch sử sử dụng")
  })
  @PatchMapping("/{serial}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> updatePaymentStatus(
    @Parameter(description = "Mã Serial của thiết bị") @PathVariable String serial,
    @Parameter(description = "Phương thức thanh toán (CASH, BANK_TRANSFER, ...)") @RequestParam String method
  ) {
    log.info("Updating payment status for serial {}", serial);
    useCase.updatePaymentStatus(serial, method);
    return Utils.returnOkResponse("Cập nhật trạng thái thanh toán thành công", null);
  }

  @Operation(summary = "Lấy lịch sử sử dụng theo danh sách mã khách hàng", description = "Dùng cho module xem hóa đơn hoặc báo cáo tổng hợp")
  @GetMapping("/batch")
  public ResponseEntity<WrapperApiResponse> getByCustomerIds(@RequestParam("ids") Collection<String> ids) {
    log.info("Get by customer ids {}", ids);
    var response = useCase.getUsageByCustomerIds(ids);
    return Utils.returnOkResponse("Lấy lịch sử sử dụng thành công", response);
  }

  @Operation(summary = "Xem lịch sử sử dụng nước của khách hàng", description = "Lấy toàn bộ lịch sử ghi nước và thanh toán tiền nước của một khách hàng theo ID")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Lấy thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lịch sử sử dụng nước cho khách hàng")
  })
  @GetMapping("/customer/{customerId}")
  public ResponseEntity<WrapperApiResponse> getUsageHistoryByCustomerId(
    @Parameter(description = "Mã ID của khách hàng", example = "CUST-2024-001") @PathVariable String customerId
  ) {
    log.info("Get usage history for customer {}", customerId);
    var response = useCase.getUsageHistoryByCustomerId(customerId);
    return Utils.returnOkResponse("Lấy lịch sử sử dụng nước thành công", response);
  }

  @Operation(summary = "Xem lượng tiêu thụ nước", description = "Cho phép nhân viên kinh doanh, IT, khảo sát xem lượng tiêu thụ nước để kiểm tra bất thường")
  @GetMapping("/consumption-report")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> getConsumptionReport(
    @RequestParam(required = false) Collection<String> ids
  ) {
    // For now, reuse getByCustomerIds or add pagination if needed
    var response = useCase.getUsageByCustomerIds(ids);
    return Utils.returnOkResponse("Lấy báo cáo tiêu thụ thành công", response);
  }

  @Operation(summary = "Cập nhật ghi tiêu thụ nước", description = "Cập nhật lại chỉ số nếu phát hiện sai sót hoặc bất thường")
  @PutMapping("/{serial}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateUsage(
    @PathVariable String serial,
    @RequestParam LocalDate date,
    @RequestParam BigDecimal index,
    @RequestParam(required = false) String imageUrl
  ) {
    var response = useCase.updateUsage(serial, date, index, imageUrl);
    return Utils.returnOkResponse("Cập nhật bản ghi tiêu thụ thành công", response);
  }

  @Operation(summary = "Lấy danh sách các bản ghi cần phê duyệt", description = "Danh sách các chỉ số nước do AI nhận diện đang chờ xác nhận")
  @GetMapping("/pending-reviews")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> getPendingReviews(@RequestParam(required = false) String roadmapId) {
    log.info("===================================================");
    log.info("Fetching pending reviews for roadmapId: {}", roadmapId);
    var response = useCase.getPendingReviews(roadmapId);
    log.info("Response serial: {}, index: {}", response.getFirst().serial(), response.getFirst().newIndexAI());
    return Utils.returnOkResponse("Lấy danh sách chờ duyệt thành công", response);
  }

  @Operation(summary = "Lấy dữ liệu tiêu thụ gần nhất (3 tháng)", description = "Lấy hình ảnh mới nhất và chỉ số + số tiền của 3 tháng liền kề")
  @GetMapping("/recent/{customerId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> getRecentUsage(
    @Parameter(description = "Mã ID của khách hàng", example = "CUST-2024-001") @PathVariable String customerId
  ) {
    log.info("Fetching recent usage for customer {}", customerId);
    var response = useCase.getRecentUsage(customerId);
    return Utils.returnOkResponse("Lấy dữ liệu tiêu thụ gần nhất thành công", response);
  }

  @Operation(summary = "Lấy hình ảnh đồng hồ mới nhất", description = "Lấy ra URL hình ảnh của lần gần nhất đã chụp đồng hồ của khách hàng")
  @GetMapping("/latest-image/{customerId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'METER_INSPECTION_STAFF', 'BUSINESS_DEPARTMENT_HEAD', 'SURVEY_STAFF')")
  public ResponseEntity<WrapperApiResponse> getLatestImage(
    @Parameter(description = "Mã ID của khách hàng", example = "CUST-2024-001") @PathVariable String customerId
  ) {
    log.info("Fetching latest image for customer {}", customerId);
    var response = useCase.getLatestImage(customerId);
    return Utils.returnOkResponse("Lấy hình ảnh đồng hồ mới nhất thành công", response);
  }

  @GetMapping("/image/{fileName}")
  public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
    var path = Paths.get("uploads/images/", fileName);
    UrlResource resource = null;
    try {
      resource = new UrlResource(path.toUri());
    } catch (MalformedURLException e) {
      throw new InternalServerException();
    }

    return ResponseEntity.ok()
      .contentType(MediaType.IMAGE_JPEG)
      .body(resource);
  }
}
