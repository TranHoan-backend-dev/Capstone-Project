package com.capstone.organization.controller;

import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.WrapperApiResponse;
import com.capstone.organization.service.boundary.BusinessPageService;
import com.capstone.organization.utils.IdEncoder;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.time.LocalDateTime;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/business-pages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BusinessPageController {
  BusinessPageService businessPageService;

  @PostMapping
  @Operation(summary = "Create a business page", description = "Create a new business page and return its data.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Business page created"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> createBusinessPage(
    @RequestBody @Valid CreateBusinessPageRequest request
  ) {
    log.info("Create business page request comes to endpoint: {}", request);
    var response = businessPageService.createBusinessPage(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      "Create business page successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @PutMapping("/{pageId}")
  @Operation(summary = "Update a business page", description = "Update business page by encoded ID.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Business page updated"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "404", description = "Business page not found", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateBusinessPage(
    @Parameter(
      in = ParameterIn.PATH,
      description = "Encoded business page ID",
      required = true,
      schema = @Schema(type = "string")
    )
    @PathVariable @NotBlank String pageId,
    @RequestBody @Valid UpdateBusinessPageRequest request
  ) {
    log.info("Update business page request comes to endpoint: {}", pageId);
    var response = businessPageService.updateBusinessPage(decodeId(pageId, "pageId"), request);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Update business page successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @GetMapping
  @Operation(summary = "List business pages", description = "Get a paged list of business pages.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Business pages fetched"),
    @ApiResponse(responseCode = "400", description = "Invalid paging parameters", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> getBusinessPages(
    @Parameter(
      in = ParameterIn.QUERY,
      description = "Page index (0-based)",
      schema = @Schema(type = "integer", defaultValue = "0", minimum = "0")
    )
    @RequestParam(defaultValue = "0") @PositiveOrZero int page,
    @Parameter(
      in = ParameterIn.QUERY,
      description = "Page size",
      schema = @Schema(type = "integer", defaultValue = "20", minimum = "1")
    )
    @RequestParam(defaultValue = "20") @Positive int size
  ) {
    var response = businessPageService.getBusinessPages(page, size);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get business pages successfully",
      response,
      LocalDateTime.now()
    ));
  }

  private @NonNull String decodeId(String encodedId, String fieldName) {
    var decoded = IdEncoder.decode(encodedId);
    if (decoded == null || decoded.isBlank()) {
      throw new IllegalArgumentException(fieldName + " is invalid");
    }
    return decoded;
  }
}
