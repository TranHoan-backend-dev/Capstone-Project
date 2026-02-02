package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.NeighborhoodUnitUseCase;
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
@RequestMapping("/units")
@RequiredArgsConstructor
@Tag(name = "Neighborhood Unit Management", description = "APIs for managing residential neighborhood units (tổ dân phố)")
public class NeighborhoodUnitController {
    private final NeighborhoodUnitUseCase unitUseCase;

    @PostMapping
    @Operation(summary = "Create a new neighborhood unit", description = "Adds a new neighborhood unit linked to a commune. Name must be unique.", responses = {
            @ApiResponse(responseCode = "201", description = "Neighborhood unit created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or commune ID"),
            @ApiResponse(responseCode = "409", description = "Unit with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createUnit(@RequestBody @Valid NeighborhoodUnitRequest request) {
        log.info("REST request to create unit: {}", request.name());
        var response = unitUseCase.createUnit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Neighborhood unit created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing neighborhood unit", description = "Updates the name or associated commune of an existing unit entry.", responses = {
            @ApiResponse(responseCode = "200", description = "Unit updated successfully"),
            @ApiResponse(responseCode = "404", description = "Unit or targeted commune not found"),
            @ApiResponse(responseCode = "409", description = "New unit name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateUnit(
            @PathVariable @Parameter(description = "ID of the unit to update", required = true) String id,
            @RequestBody @Valid NeighborhoodUnitRequest request) {
        log.info("REST request to update unit: {}", id);
        var response = unitUseCase.updateUnit(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Neighborhood unit updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a neighborhood unit", description = "Removes a neighborhood unit from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Unit deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Unit not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteUnit(
            @PathVariable @Parameter(description = "ID of the unit to delete", required = true) String id) {
        log.info("REST request to delete unit: {}", id);
        unitUseCase.deleteUnit(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Neighborhood unit deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get unit by ID", description = "Retrieves information for a single neighborhood unit.", responses = {
            @ApiResponse(responseCode = "200", description = "Unit found"),
            @ApiResponse(responseCode = "404", description = "Unit not found")
    })
    public ResponseEntity<WrapperApiResponse> getUnitById(
            @PathVariable @Parameter(description = "ID of the unit to retrieve", required = true) String id) {
        log.info("REST request to get unit: {}", id);
        var response = unitUseCase.getUnitById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Neighborhood unit retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all neighborhood units", description = "Returns a paginated list of all neighborhood units recorded in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of units retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllUnits(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all units");
        var response = unitUseCase.getAllUnits(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Neighborhood units retrieved successfully", response, LocalDateTime.now()));
    }
}
