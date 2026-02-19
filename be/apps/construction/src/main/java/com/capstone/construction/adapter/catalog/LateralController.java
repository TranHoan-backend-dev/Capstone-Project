package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.usecase.catalog.LateralUseCase;
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
@RequiredArgsConstructor
@RequestMapping("/laterals")
// TODO: openapi doc, unit test
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Lateral Management", description = "APIs for managing water supply laterals (tuyến ống)")
public class LateralController {
  final LateralUseCase lateralUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "Create a new lateral", description = "Adds a new water supply lateral linked to a specific network. Name must be unique.", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "Invalid request payload or network ID", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createLateral(@RequestBody @Valid LateralRequest request) {
    log.info("REST request to create lateral: {}", request.name());
    var response = lateralUseCase.createLateral(request);
    log.info("Created lateral: {}", response);
    return Utils.returnCreatedResponse("Lateral created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateLateral(
    @PathVariable @Parameter(description = "ID of the lateral to update", required = true) String id,
    @RequestBody @Valid LateralRequest request) {
    log.info("REST request to update lateral: {}", id);
    var response = lateralUseCase.updateLateral(id, request);
    return Utils.returnOkResponse("Lateral updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteLateral(
    @PathVariable @Parameter(description = "ID of the lateral to delete", required = true) String id) {
    log.info("REST request to delete lateral: {}", id);
    lateralUseCase.deleteLateral(id);
    return Utils.returnOkResponse("Lateral deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getLateralById(
    @PathVariable @Parameter(description = "ID of the lateral to retrieve", required = true) String id) {
    log.info("REST request to get lateral: {}", id);
    var response = lateralUseCase.getLateralById(id);
    return Utils.returnOkResponse("Lateral retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "")
  })
  public ResponseEntity<WrapperApiResponse> getAllLaterals(
    @PageableDefault @Parameter(description = "Pagination parameters") Pageable pageable) {
    log.info("REST request to get all laterals");
    var response = lateralUseCase.getAllLaterals(pageable);
    return Utils.returnOkResponse("Laterals retrieved successfully", response);
  }
}
