package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.waterprice.WaterPriceService;
import com.capstone.device.application.dto.request.WaterPriceRequest;
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
@RequestMapping("/water-prices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Water Price Management", description = "Endpoints for managing water pricing policies and usage targets")
public class WaterPriceController {
  WaterPriceService waterPriceService;
  @NonFinal
  Logger log;

  @Operation(summary = "Create a new water price", description = "Adds a new water pricing policy to the system", responses = {
    @ApiResponse(responseCode = "201", description = "Water price created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createWaterPrice(@RequestBody @Valid WaterPriceRequest request) {
    log.info("REST request to create water price for target: {}", request.usageTarget());
    var response = waterPriceService.createWaterPrice(request);
    return Utils.returnCreatedResponse("Water price created successfully", response);
  }

  @Operation(summary = "Update a water price", description = "Updates details of an existing water pricing policy", responses = {
    @ApiResponse(responseCode = "200", description = "Water price updated successfully"),
    @ApiResponse(responseCode = "404", description = "Water price not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateWaterPrice(
    @PathVariable @Parameter(description = "Water Price ID") String id,
    @RequestBody @Valid WaterPriceRequest request) {
    log.info("REST request to update water price: {}", id);
    var response = waterPriceService.updateWaterPrice(id, request);
    return Utils.returnOkResponse("Water price updated successfully", response);
  }

  @Operation(summary = "Delete a water price", description = "Removes a water pricing policy from the system", responses = {
    @ApiResponse(responseCode = "200", description = "Water price deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Water price not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteWaterPrice(
    @PathVariable @Parameter(description = "Water Price ID") String id) {
    log.info("REST request to delete water price: {}", id);
    waterPriceService.deleteWaterPrice(id);
    return Utils.returnOkResponse("Water price deleted successfully", null);
  }

  @Operation(summary = "Get water price by ID", description = "Fetches detailed information of a water pricing policy", responses = {
    @ApiResponse(responseCode = "200", description = "Water price found"),
    @ApiResponse(responseCode = "404", description = "Water price not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterPriceById(
    @PathVariable @Parameter(description = "Water Price ID") String id) {
    log.info("REST request to get water price: {}", id);
    var response = waterPriceService.getWaterPriceById(id);
    return Utils.returnOkResponse("Water price retrieved successfully", response);
  }

  @Operation(summary = "Get all water prices", description = "Retrieves a paginated list of all water pricing policies")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterPrices(@PageableDefault Pageable pageable) {
    log.info("REST request to get all water prices with pagination: {}", pageable);
    var response = waterPriceService.getAllWaterPrices(pageable);
    return Utils.returnOkResponse("Water prices retrieved successfully", response);
  }
}
