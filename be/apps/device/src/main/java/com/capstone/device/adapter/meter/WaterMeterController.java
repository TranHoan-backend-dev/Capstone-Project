package com.capstone.device.adapter.meter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.WaterMeterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
public class WaterMeterController {
  WaterMeterService waterMeterService;
  @NonFinal
  Logger log;

  @PostMapping
  public ResponseEntity<WrapperApiResponse> createWaterMeter(@RequestBody @Valid WaterMeterRequest request) {
    log.info("REST request to create water meter: {}", request.size());
    waterMeterService.createWaterMeter(request);
    return Utils.returnCreatedResponse("Tạo đồng hồ nước thành công");
  }

  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateWaterMeter(
    @PathVariable String id,
    @RequestBody @Valid WaterMeterRequest request
  ) {
    log.info("REST request to update water meter: {}", id);
    var response = waterMeterService.updateWaterMeter(id, request);
    return Utils.returnOkResponse("Cập nhật đồng hồ nước thành công", response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteWaterMeter(@PathVariable String id) {
    log.info("REST request to delete water meter: {}", id);
    waterMeterService.deleteWaterMeter(id);
    return Utils.returnOkResponse("Xóa đồng hồ nước thành công", null);
  }

  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterMeterById(@PathVariable String id) {
    log.info("REST request to get water meter: {}", id);
    var response = waterMeterService.getWaterMeterById(id);
    return Utils.returnOkResponse("Lấy thông tin đồng hồ nước thành công", response);
  }

  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterMeters(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water meters with pagination: {}", pageable);
    var response = waterMeterService.getAllWaterMeters(pageable);
    return Utils.returnOkResponse("Lấy danh sách đồng hồ nước thành công", response);
  }

  @Operation(hidden = true)
  @GetMapping("/{id}/exists")
  public Boolean checkWaterMeterExisting(@PathVariable String id) {
    log.info("REST request to check existence of water meter: {}", id);
    var response = waterMeterService.isWaterMeterExisting(id);
    log.info("Meter is existed? {}", response);
    return response;
  }
}
