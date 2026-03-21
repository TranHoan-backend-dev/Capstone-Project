package com.capstone.device.adapter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.UsageHistoryRequest;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/usage")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Tag(name = "Lịch sử sử dụng", description = "Các API quản lý lịch sử ghi nước và thanh toán của thiết bị")
public class UsageHistoryController {
  UsageHistoryUseCase useCase;

  @Operation(
    summary = "Cập nhật chỉ số nước tháng này",
    description = "Ghi nhận chỉ số nước mới từ hình ảnh đồng hồ cho thiết bị theo mã Serial"
  )
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công",
      content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc chỉ số mới thấp hơn kỳ trước"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy thiết bị")
  })
  @PostMapping(value = "/{serial}", consumes = "multipart/form-data")
  public ResponseEntity<WrapperApiResponse> updateWaterIndexThisMonth(
    @Parameter(description = "Mã Serial của thiết bị", example = "WM-2024-001")
    @PathVariable String serial,
    @ModelAttribute @Valid UsageHistoryRequest request
  ) {
    log.info("Updating usage history for serial {}", serial);
    var response = useCase.updateWaterIndex(request, serial);
    return Utils.returnOkResponse("Cập nhật chỉ số nước thành công", response);
  }

  @Operation(
    summary = "Cập nhật trạng thái thanh toán",
    description = "Đánh dấu là đã thanh toán cho bản ghi có ngày đo mới nhất của thiết bị"
  )
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Cập nhật trạng thái thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lịch sử sử dụng")
  })
  @PatchMapping("/{serial}")
  public ResponseEntity<WrapperApiResponse> updatePaymentStatus(
    @Parameter(description = "Mã Serial của thiết bị")
    @PathVariable String serial,
    @Parameter(description = "Phương thức thanh toán (CASH, BANK_TRANSFER, ...)")
    @RequestParam String method
  ) {
    log.info("Updating payment status for serial {}", serial);
    useCase.updatePaymentStatus(serial, method);
    return Utils.returnOkResponse("Cập nhật trạng thái thanh toán thành công", null);
  }
}
