package com.capstone.construction.adapter.catalog;

import com.capstone.common.utils.WrapperApiResponse;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.usecase.catalog.RoadUseCase;
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
@RequestMapping("/roads")
@RequiredArgsConstructor
@Tag(name = "Road Management", description = "APIs for managing road infrastructure records")
public class RoadController {
  private final RoadUseCase roadUseCase;

  @PostMapping
  @Operation(summary = "Create a new road", description = "Adds a new road entry to the system catalog. Road name must be unique.", responses = {
    @ApiResponse(responseCode = "201", description = "Road created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid request payload"),
    @ApiResponse(responseCode = "409", description = "Road with this name already exists")
  })
  public ResponseEntity<WrapperApiResponse> createRoad(@RequestBody @Valid RoadRequest request) {
    log.info("REST request to create road: {}", request.name());
    var response = roadUseCase.createRoad(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(), "Road created successfully", response, LocalDateTime.now()));
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update an existing road", description = "Updates the name or attributes of an existing road entry.", responses = {
    @ApiResponse(responseCode = "200", description = "Road updated successfully"),
    @ApiResponse(responseCode = "404", description = "Road not found"),
    @ApiResponse(responseCode = "409", description = "New road name already exists")
  })
  public ResponseEntity<WrapperApiResponse> updateRoad(
    @PathVariable @Parameter(description = "ID of the road to update", required = true) String id,
    @RequestBody @Valid RoadRequest request) {
    log.info("REST request to update road: {}", id);
    var response = roadUseCase.updateRoad(id, request);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Road updated successfully", response, LocalDateTime.now()));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete a road", description = "Removes a road record from the system.", responses = {
    @ApiResponse(responseCode = "200", description = "Road deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Road not found")
  })
  public ResponseEntity<WrapperApiResponse> deleteRoad(
    @PathVariable @Parameter(description = "ID of the road to delete", required = true) String id) {
    log.info("REST request to delete road: {}", id);
    roadUseCase.deleteRoad(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Road deleted successfully", null, LocalDateTime.now()));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get road by ID", description = "Retrieves information for a specific road by its ID.", responses = {
    @ApiResponse(responseCode = "200", description = "Road found"),
    @ApiResponse(responseCode = "404", description = "Road not found")
  })
  public ResponseEntity<WrapperApiResponse> getRoadById(
    @PathVariable @Parameter(description = "ID of the road to retrieve", required = true) String id) {
    log.info("REST request to get road: {}", id);
    var response = roadUseCase.getRoadById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Road retrieved successfully", response, LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "Get all roads", description = "Returns a paginated list of all roads in the catalog.", responses = {
    @ApiResponse(responseCode = "200", description = "List of roads retrieved successfully")
  })
  public ResponseEntity<WrapperApiResponse> getAllRoads(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable) {
    log.info("REST request to get all roads");
    var response = roadUseCase.getAllRoads(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Roads retrieved successfully", response, LocalDateTime.now()));
  }
}
