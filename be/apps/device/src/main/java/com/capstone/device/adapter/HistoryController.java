package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.usecase.DeviceManagementHistoryUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// for system logging
@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/history")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Tag(name = "History API", description = "API cho phép xem lịch sử chỉnh sửa các mục")
public class HistoryController {

  DeviceManagementHistoryUseCase historyUseCase;

  @GetMapping("/device-management")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  @Operation(summary = "", description = "Cho phép admin xem lịch sử chỉnh sửa tất cả thông tin thuộc về phần Device Management", responses = {
      @ApiResponse(responseCode = "200", description = "Lấy lịch sử lịch sửa thành công", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getDeviceManagementHistory() {
    var response = historyUseCase.getDeviceManagementHistory();
    return Utils.returnOkResponse("Lấy lịch sử chỉnh sửa thành công", response);
  }
}
