package com.capstone.organization.controller;

import com.capstone.organization.dto.request.FilterBusinessPagesRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.WrapperApiResponse;
import com.capstone.organization.service.boundary.BusinessPageService;
import com.capstone.organization.utils.IdEncoder;
import com.capstone.organization.utils.Utils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.Arrays;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/business-pages")
@PreAuthorize("hasAuthority('IT_STAFF')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Business Page", description = "Endpoints for managing business pages. All users must have IT_STAFF role in order to access those endpoints")
public class BusinessPageController {
  BusinessPageService businessPageService;

  @PutMapping("/{pageId}")
  @Operation(summary = "Update a business page", description = "Update an existing business page by its encoded ID.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Business page updated", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "404", description = "Business page not found", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateBusinessPage(
    @Parameter(in = ParameterIn.PATH, description = "Encoded business page ID", required = true, schema = @Schema(type = "string")) @PathVariable @NotBlank String pageId,
    @RequestBody @Valid UpdateBusinessPageRequest request) {
    log.info("Update business page request comes to endpoint: {}", pageId);

    var response = businessPageService.updateBusinessPage(decodeId(pageId, "pageId"), request);

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Update business page successfully",
      response,
      LocalDateTime.now()));
  }

  @GetMapping
  @Operation(summary = "List and Filter business pages", description = "Get a paged list of business pages with optional filtering by name and activation status. Results are wrapped in a standard API response.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Business pages fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid request or paging parameters", content = @Content),
    @ApiResponse(responseCode = "401", description = "Unauthorized access", content = @Content),
    @ApiResponse(responseCode = "403", description = "Forbidden - Requires IT_STAFF role", content = @Content),
    @ApiResponse(responseCode = "500", description = "Internal server error occurred while processing the request", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> getBusinessPages(
    @Parameter(description = "Pagination parameters (page, size, sort)") Pageable pageable,
    @Parameter(description = "Filtering criteria (name filter and active status)") FilterBusinessPagesRequest request) {
    log.info("Get business pages request comes to endpoint: page={}, size={}", pageable.getPageNumber(),
      pageable.getPageSize());

    var status = (request.filter() != null && !request.filter().isBlank()) || request.isActive() != null;
    var response = status ? businessPageService.filterBusinessPagesList(request, pageable)
      : businessPageService.getBusinessPages(pageable);

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Get business pages successfully",
      response);
  }

  @GetMapping("/e")
  @Operation(summary = "Resolve business page names by IDs", description = "Retrieves a list of business page names corresponding to the provided comma-separated list of page IDs. Response data includes a list of string"
    +
    "This endpoint is used to resolve page identifiers into human-readable names, typically to display the pages an employee is authorized to access.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of page names", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<?> queryAllPagesById(
    @Parameter(description = "Comma-separated list of business page IDs to resolve", required = true) @RequestParam("id") String idsList) {
    log.info("REST request to query all pages by ids: {}", idsList);
    var content = Arrays
      .stream(idsList.split(", "))
      .map(String::trim).filter(c -> !c.isBlank())
      .toList();

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Get all pages by list of ids successfully",
      businessPageService.getAllBusinessPageNamesByIds(content));
  }

  private @NonNull String decodeId(String encodedId, String fieldName) {
    var decoded = IdEncoder.decode(encodedId);
    if (decoded == null || decoded.isBlank()) {
      throw new IllegalArgumentException(fieldName + " is invalid");
    }
    return decoded;
  }
}
