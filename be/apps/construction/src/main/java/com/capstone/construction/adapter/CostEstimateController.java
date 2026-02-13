package com.capstone.construction.adapter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
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
    @Operation(summary = "Create a new cost estimate", description = "Initializes a new cost estimate record for a construction project.", responses = {
            @ApiResponse(responseCode = "201", description = "Estimate created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload")
    })
    public ResponseEntity<WrapperApiResponse> createEstimate(@RequestBody @Valid CostEstimateRequest request) {
        log.info("REST request to create cost estimate for customer: {}", request.customerName());
        var response = estimateUseCase.createEstimate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Cost estimate created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing cost estimate", description = "Updates the details of an existing cost estimate entry identified by ID.", responses = {
            @ApiResponse(responseCode = "200", description = "Estimate updated successfully"),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    public ResponseEntity<WrapperApiResponse> updateEstimate(
            @PathVariable @Parameter(description = "ID of the estimate to update", required = true) String id,
            @RequestBody @Valid CostEstimateRequest request) {
        log.info("REST request to update cost estimate with id: {}", id);
        var response = estimateUseCase.updateEstimate(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Cost estimate updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a cost estimate", description = "Removes a cost estimate record from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Estimate deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteEstimate(
            @PathVariable @Parameter(description = "ID of the estimate to delete", required = true) String id) {
        log.info("REST request to delete cost estimate with id: {}", id);
        estimateUseCase.deleteEstimate(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Cost estimate deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cost estimate by ID", description = "Retrieves detailed information for a specific cost estimate entry.", responses = {
            @ApiResponse(responseCode = "200", description = "Estimate found"),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    public ResponseEntity<WrapperApiResponse> getEstimateById(
            @PathVariable @Parameter(description = "ID of the estimate to retrieve", required = true) String id) {
        log.info("REST request to get cost estimate with id: {}", id);
        var response = estimateUseCase.getEstimateById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Cost estimate retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all cost estimates", description = "Returns a paginated list of all cost estimates recorded in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of estimates retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllEstimates(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all cost estimates");
        var response = estimateUseCase.getAllEstimates(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Cost estimates retrieved successfully", response, LocalDateTime.now()));
    }
}
