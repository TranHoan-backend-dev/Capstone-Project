package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import com.capstone.device.application.usecase.WaterPriceUseCase;
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
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@AppLog
@Validated
@RestController
@RequestMapping("/water-prices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "", description = "")
public class WaterPriceController {
  WaterPriceUseCase useCase;
  @NonFinal
  Logger log;

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createWaterPrice(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create water price for target: {}", request.usageTarget());
    var response = useCase.createWaterPrice(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Water price created successfully");
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = WaterPriceResponse.class))),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateWaterPrice(
    @PathVariable @Parameter(description = "") String id,
    @RequestBody @Valid UpdateRequest request) {
    log.info("REST request to update water price: {}", id);
    var response = useCase.updateWaterPrice(id, request);
    return Utils.returnOkResponse("Water price updated successfully", response);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteWaterPrice(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to delete water price: {}", id);
    useCase.deleteWaterPrice(id);
    return Utils.returnOkResponse("Water price deleted successfully", null);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getWaterPriceById(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to get water price: {}", id);
    var response = useCase.getWaterPriceById(id);
    return Utils.returnOkResponse("Water price retrieved successfully", response);
  }

  // TODO: swagger doc, unit test
  @Operation(summary = "Lấy danh sách các bảng giá nước", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = WaterPriceResponse.class))),
    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllWaterPrices(
    @PageableDefault Pageable pageable,
    @RequestParam(value = "keyword", required = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Valid LocalDate applicationPeriod
  ) {
    log.info("REST request to get all water prices with pagination: {}", pageable);
    var response = useCase.getPricesList(pageable, applicationPeriod);
    return Utils.returnOkResponse("Water prices retrieved successfully", response);
  }
}
