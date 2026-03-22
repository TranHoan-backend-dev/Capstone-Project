package com.capstone.device.adapter.meter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.WaterMeterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/water-meters")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "", description = "")
public class WaterMeterController {
  WaterMeterService waterMeterService;
  @NonFinal
  Logger log;

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createWaterMeter(@RequestBody @Valid WaterMeterRequest request) {
    log.info("REST request to create water meter: {}", request.size());
    waterMeterService.createWaterMeter(request);
    return Utils.returnCreatedResponse("Tạo đồng hồ nước thành công");
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateWaterMeter(
    @PathVariable @Parameter(description = "") String id,
    @RequestBody @Valid WaterMeterRequest request
  ) {
    log.info("REST request to update water meter: {}", id);
    var response = waterMeterService.updateWaterMeter(id, request);
    return Utils.returnOkResponse("Cập nhật đồng hồ nước thành công", response);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteWaterMeter(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to delete water meter: {}", id);
    waterMeterService.deleteWaterMeter(id);
    return Utils.returnOkResponse("Xóa đồng hồ nước thành công", null);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterMeterById(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to get water meter: {}", id);
    var response = waterMeterService.getWaterMeterById(id);
    return Utils.returnOkResponse("Lấy thông tin đồng hồ nước thành công", response);
  }

  @Operation(summary = "", description = "")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterMeters(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water meters with pagination: {}", pageable);
    var response = waterMeterService.getAllWaterMeters(pageable);
    return Utils.returnOkResponse("Lấy danh sách đồng hồ nước thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/{id}/exists")
  public Boolean checkWaterMeterExisting(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to check existence of water meter: {}", id);
    var response = waterMeterService.isWaterMeterExisting(id);
    log.info("Meter is existed? {}", response);
    return response;
  }
}
