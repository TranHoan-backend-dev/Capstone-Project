package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.boundary.WaterMeterService;
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
@Tag(name = "Water Meter Management", description = "Endpoints for managing water meters and their technical details")
public class WaterMeterController {
  WaterMeterService waterMeterService;
  @NonFinal
  Logger log;

  @Operation(summary = "Create a new water meter", description = "Adds a new water meter record to the system", responses = {
      @ApiResponse(responseCode = "201", description = "Water meter created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createWaterMeter(@RequestBody @Valid WaterMeterRequest request) {
    log.info("REST request to create water meter: {}", request.size());
    var response = waterMeterService.createWaterMeter(request);
    return Utils.returnCreatedResponse("Water meter created successfully", response);
  }

  @Operation(summary = "Update a water meter", description = "Updates details of an existing water meter record", responses = {
      @ApiResponse(responseCode = "200", description = "Water meter updated successfully"),
      @ApiResponse(responseCode = "404", description = "Water meter not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateWaterMeter(
      @PathVariable @Parameter(description = "Water Meter ID") String id,
      @RequestBody @Valid WaterMeterRequest request) {
    log.info("REST request to update water meter: {}", id);
    var response = waterMeterService.updateWaterMeter(id, request);
    return Utils.returnOkResponse("Water meter updated successfully", response);
  }

  @Operation(summary = "Delete a water meter", description = "Removes a water meter record from the system", responses = {
      @ApiResponse(responseCode = "200", description = "Water meter deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Water meter not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteWaterMeter(
      @PathVariable @Parameter(description = "Water Meter ID") String id) {
    log.info("REST request to delete water meter: {}", id);
    waterMeterService.deleteWaterMeter(id);
    return Utils.returnOkResponse("Water meter deleted successfully", null);
  }

  @Operation(summary = "Get water meter by ID", description = "Fetches detailed information of a water meter record", responses = {
      @ApiResponse(responseCode = "200", description = "Water meter found"),
      @ApiResponse(responseCode = "404", description = "Water meter not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterMeterById(
      @PathVariable @Parameter(description = "Water Meter ID") String id) {
    log.info("REST request to get water meter: {}", id);
    var response = waterMeterService.getWaterMeterById(id);
    return Utils.returnOkResponse("Water meter retrieved successfully", response);
  }

  @Operation(summary = "Get all water meters", description = "Retrieves a paginated list of all water meter records")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterMeters(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water meters with pagination: {}", pageable);
    var response = waterMeterService.getAllWaterMeters(pageable);
    return Utils.returnOkResponse("Water meters retrieved successfully", response);
  }

  @Operation(summary = "Check if water meter exists", description = "Checks whether a water meter with the given ID exists")
  @GetMapping("/{id}/exists")
  public ResponseEntity<WrapperApiResponse> checkWaterMeterExisting(
      @PathVariable @Parameter(description = "Water Meter ID") String id) {
    log.info("REST request to check existence of water meter: {}", id);
    return Utils.returnOkResponse("Check water meter existence successfully",
        waterMeterService.isWaterMeterExisting(id));
  }
}
