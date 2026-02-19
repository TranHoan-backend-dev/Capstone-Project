package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.usecase.catalog.CommuneUseCase;
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
@RequestMapping("/communes")
@RequiredArgsConstructor
// TODO: Openapi doc, unit test
@Tag(name = "", description = "")
public class CommuneController {
  private final CommuneUseCase communeUseCase;

  @PostMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createCommune(@RequestBody @Valid CommuneRequest request) {
    log.info("REST request to create commune: {}", request.name());
    communeUseCase.createCommune(request);
    return Utils.returnCreatedResponse("Commune created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "", description = "", parameters = {
    @Parameter(name = "id", description = "", required = true, example = "")
  }, responses = {
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = CommuneResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateCommune(
    @PathVariable @Parameter(description = "ID of the commune to update") String id,
    @RequestBody @Valid CommuneRequest request) {
    log.info("REST request to update commune: {}", id);
    var response = communeUseCase.updateCommune(id, request);
    return Utils.returnOkResponse("Commune updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteCommune(
    @PathVariable
    @Parameter(description = "ID of the commune to delete") String id
  ) {
    log.info("REST request to delete commune: {}", id);
    communeUseCase.deleteCommune(id);
    return Utils.returnOkResponse("Commune deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CommuneResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getCommuneById(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to get commune: {}", id);
    var response = communeUseCase.getCommuneById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Commune retrieved successfully", response, LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CommuneResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllCommunes(
    @PageableDefault @Parameter(description = "") Pageable pageable) {
    log.info("REST request to get all communes");
    var response = communeUseCase.getAllCommunes(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(), "Communes retrieved successfully", response, LocalDateTime.now()));
  }
}
