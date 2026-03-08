package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.application.usecase.WaterMeterUseCase;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/water-meters")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "", description = "")
public class WaterMeterController {
  WaterMeterService waterMeterService;
  WaterMeterUseCase waterMeterUseCase;
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
    return Utils.returnCreatedResponse("Water meter created successfully");
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateWaterMeter(
    @PathVariable @Parameter(description = "") String id,
    @RequestBody @Valid WaterMeterRequest request) {
    log.info("REST request to update water meter: {}", id);
    var response = waterMeterService.updateWaterMeter(id, request);
    return Utils.returnOkResponse("Water meter updated successfully", response);
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
    return Utils.returnOkResponse("Water meter deleted successfully", null);
  }

  @DeleteMapping("/overall/lateral")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteByLateral(
    @RequestParam String id) {
    log.info("REST request to delete water meter by lateral: {}", id);
    waterMeterUseCase.deleteOverallWaterMeterByLateralId(id);
    return Utils.returnOkResponse("Water meter deleted successfully", null);
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
    return Utils.returnOkResponse("Water meter retrieved successfully", response);
  }

  @Operation(summary = "", description = "")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterMeters(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water meters with pagination: {}", pageable);
    var response = waterMeterService.getAllWaterMeters(pageable);
    return Utils.returnOkResponse("Water meters retrieved successfully", response);
  }

  @Operation(summary = "", description = "")
  @GetMapping("/overall/{id}/exists")
  public ResponseEntity<WrapperApiResponse> checkOverallWaterMeterExisting(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to check existence of water meter: {}", id);
    var response = waterMeterService.isOverallWaterMeterExisting(id);
    log.info("Meter is existed? {}", response);
    return Utils.returnOkResponse("Check water meter existence successfully", response);
  }
}
