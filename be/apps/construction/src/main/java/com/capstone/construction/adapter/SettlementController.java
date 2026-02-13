package com.capstone.construction.adapter;

import com.capstone.common.utils.WrapperApiResponse;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.usecase.settlement.SettlementUseCase;
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
@RequestMapping("/settlements")
@RequiredArgsConstructor
@Tag(name = "Settlement Management", description = "APIs for managing project settlements (quyết toán công trình)")
public class SettlementController {
    private final SettlementUseCase settlementUseCase;

    @PostMapping
    @Operation(summary = "Create a new settlement", description = "Initializes a new project settlement record.", responses = {
            @ApiResponse(responseCode = "201", description = "Settlement created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload")
    })
    public ResponseEntity<WrapperApiResponse> createSettlement(@RequestBody @Valid SettlementRequest request) {
        log.info("REST request to create settlement for address: {}", request.address());
        var response = settlementUseCase.createSettlement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Settlement created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing settlement", description = "Updates the details of an existing settlement identified by ID.", responses = {
            @ApiResponse(responseCode = "200", description = "Settlement updated successfully"),
            @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    public ResponseEntity<WrapperApiResponse> updateSettlement(
            @PathVariable @Parameter(description = "ID of the settlement to update", required = true) String id,
            @RequestBody @Valid SettlementRequest request) {
        log.info("REST request to update settlement with id: {}", id);
        var response = settlementUseCase.updateSettlement(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Settlement updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a settlement", description = "Removes a settlement record from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Settlement deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteSettlement(
            @PathVariable @Parameter(description = "ID of the settlement to delete", required = true) String id) {
        log.info("REST request to delete settlement with id: {}", id);
        settlementUseCase.deleteSettlement(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Settlement deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get settlement by ID", description = "Retrieves information for a single settlement by its unique settlementId.", responses = {
            @ApiResponse(responseCode = "200", description = "Settlement found"),
            @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    public ResponseEntity<WrapperApiResponse> getSettlementById(
            @PathVariable @Parameter(description = "ID of the settlement to retrieve", required = true) String id) {
        log.info("REST request to get settlement with id: {}", id);
        var response = settlementUseCase.getSettlementById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Settlement retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all settlements", description = "Returns a paginated list of all project settlements in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of settlements retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllSettlements(
            @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all settlements");
        var response = settlementUseCase.getAllSettlements(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Settlements retrieved successfully", response, LocalDateTime.now()));
    }
}
