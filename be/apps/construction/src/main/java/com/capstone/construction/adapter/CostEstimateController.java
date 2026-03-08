package com.capstone.construction.adapter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.usecase.estimate.CostEstimateUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/estimates")
@RequiredArgsConstructor
@Tag(name = "Cost Estimate Management", description = "APIs for managing construction cost estimates (dự toán chi phí)")
public class CostEstimateController {
  private final CostEstimateUseCase estimateUseCase;

  @PostMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "400", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> createEstimate(@RequestBody @Valid CostEstimateRequest request) {
    log.info("REST request to create cost estimate for customer: {}", request.customerName());
    var response = estimateUseCase.createEstimate(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(), "Cost estimate created successfully", response, LocalDateTime.now()));
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> updateEstimate(
    @PathVariable @Parameter(description = "ID of the estimate to update", required = true) String id,
    @RequestBody @Valid CostEstimateRequest request) {
    log.info("REST request to update cost estimate with id: {}", id);
    var response = estimateUseCase.updateEstimate(id, request);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Cost estimate updated successfully", response, LocalDateTime.now()));
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getEstimateById(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to get cost estimate with id: {}", id);
    var response = estimateUseCase.getEstimateById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Cost estimate retrieved successfully", response, LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CostEstimateResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllEstimates(
    @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
    log.info("REST request to get all cost estimates");
    var response = estimateUseCase.getAllEstimates(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Cost estimates retrieved successfully", response, LocalDateTime.now()));
  }
}
