package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/units")
@RequiredArgsConstructor
@Tag(name = "", description = "")
public class NeighborhoodUnitController {
  private final NeighborhoodUnitUseCase unitUseCase;

  @PostMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createUnit(@RequestBody @Valid NeighborhoodUnitRequest request) {
    log.info("REST request to create unit: {}", request.name());
    unitUseCase.createUnit(request);
    return Utils.returnCreatedResponse("Neighborhood unit created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = NeighborhoodUnitResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateUnit(
    @PathVariable @Parameter(description = "ID of the unit to update", required = true) String id,
    @RequestBody @Valid NeighborhoodUnitRequest request) {
    log.info("REST request to update unit: {}", id);
    var response = unitUseCase.updateUnit(id, request);
    return Utils.returnOkResponse("Neighborhood unit updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteUnit(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to delete unit: {}", id);
    unitUseCase.deleteUnit(id);
    return Utils.returnOkResponse("Neighborhood unit deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getUnitById(
    @PathVariable @Parameter(description = "ID of the unit to retrieve", required = true) String id) {
    log.info("REST request to get unit: {}", id);
    var response = unitUseCase.getUnitById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Neighborhood unit retrieved successfully", response, LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = NeighborhoodUnitResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllUnits(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable) {
    log.info("REST request to get all units");
    var response = unitUseCase.getAllUnits(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Neighborhood units retrieved successfully", response, LocalDateTime.now()));
  }
}
