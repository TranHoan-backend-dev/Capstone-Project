package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.usecase.catalog.RoadUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@AppLog
@RestController
@RequestMapping("/roads")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "", description = "")
public class RoadController {
  final RoadUseCase roadUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> createRoad(@RequestBody RoadRequest request) {
    log.info("REST request to create road: {}", request.name());
    var response = roadUseCase.createRoad(request);
    log.info("Created road: {}", response);
    return Utils.returnCreatedResponse("Road created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = RoadResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> updateRoad(
    @PathVariable @Parameter(description = "", required = true) String id,
    @RequestBody RoadRequest request
  ) {
    log.info("REST request to update road: {}", id);
    var response = roadUseCase.updateRoad(id, request);
    return Utils.returnOkResponse("Road updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete a road", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> deleteRoad(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to delete road: {}", id);
    roadUseCase.deleteRoad(id);
    return Utils.returnOkResponse("Road deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = RoadResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getRoadById(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to get road: {}", id);
    var response = roadUseCase.getRoadById(id);
    return Utils.returnOkResponse("Road retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = RoadResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllRoads(
    @PageableDefault @Parameter(description = "") Pageable pageable) {
    log.info("REST request to get all roads");
    var response = roadUseCase.getAllRoads(pageable);
    return Utils.returnOkResponse("Roads retrieved successfully", response);
  }
}
