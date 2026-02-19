package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.usecase.catalog.RoadmapUseCase;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@AppLog
@RestController
@RequestMapping("/roadmaps")
@RequiredArgsConstructor
@Tag(name = "", description = "")
// TODO: openapi doc, unit test
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoadmapController {
  final RoadmapUseCase roadmapUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "400", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "409", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createRoadmap(@RequestBody @Valid RoadmapRequest request) {
    log.info("REST request to create roadmap: {}", request.name());
    var response = roadmapUseCase.createRoadmap(request);
    log.info("Created roadmap: {}", response);
    return Utils.returnCreatedResponse("Roadmap created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = RoadmapResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "409", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateRoadmap(
    @PathVariable @Parameter(description = "", required = true) String id,
    @RequestBody @Valid RoadmapRequest request) {
    log.info("REST request to update roadmap: {}", id);
    var response = roadmapUseCase.updateRoadmap(id, request);
    return Utils.returnOkResponse("Roadmap updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteRoadmap(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to delete roadmap: {}", id);
    roadmapUseCase.deleteRoadmap(id);
    return Utils.returnOkResponse("Roadmap deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getRoadmapById(
    @PathVariable @Parameter(description = "", required = true) String id) {
    log.info("REST request to get roadmap: {}", id);
    var response = roadmapUseCase.getRoadmapById(id);
    return Utils.returnOkResponse("Roadmap retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllRoadmaps(
    @PageableDefault @Parameter(description = "") Pageable pageable) {
    log.info("REST request to get all roadmaps");
    var response = roadmapUseCase.getAllRoadmaps(pageable);
    return Utils.returnOkResponse("Roadmaps retrieved successfully", response);
  }
}
