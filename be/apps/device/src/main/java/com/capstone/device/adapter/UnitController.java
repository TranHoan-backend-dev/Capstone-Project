package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.application.usecase.UnitUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/units")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Unit Controller", description = "Quản lý các đơn vị tính (Unit). Hỗ trợ các chức năng xem danh sách phân trang và lấy danh sách gợi ý.")
public class UnitController {
  @NonFinal
  Logger log;
  UnitUseCase unitUseCase;

  // TODO:
  // phuc vu cho ca admin lan cac role khac
  // admin thi lay danh sach phan trang (/)
  // role khac thi se lay ra 10 ban ghi co tan suat su dung cao nhat, sau do se
  @Operation(summary = "Lấy danh sách đơn vị tính phân trang", description = "API này cho phép Admin xem danh sách các đơn vị tính, có hỗ trợ phân trang và lọc theo tên.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UnitResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<?> getPaginatedListOfUnits(
      @Parameter(description = "Thông tin phân trang (page, size, sort)") @PageableDefault Pageable pageable,
      @Parameter(description = "Từ khóa lọc theo tên đơn vị tính") @RequestParam(required = false) String filter) {
    log.info("REST request to get paginated list of units: {}, filter: {}", pageable, filter);
    var response = unitUseCase.getUnits(pageable, filter);
    return Utils.returnOkResponse("Get paginated list of units successfully", response);
  }
}
