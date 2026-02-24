package com.capstone.customer.controller;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.BillRequest;
import com.capstone.customer.dto.response.BillResponse;
import com.capstone.customer.service.boundary.BillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
@Tag(name = "Bill Management", description = "Endpoints for managing bills and invoice information")
public class BillController {
  private final BillService billService;

  @Operation(summary = "Create a new bill", description = "Adds a new bill record linked to a customer", responses = {
    @ApiResponse(responseCode = "201", description = "Bill created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createBill(@RequestBody @Valid BillRequest request) {
    log.info("REST request to create bill for customer: {}", request.customerId());
    BillResponse response = billService.createBill(request);
    return Utils.returnCreatedResponse("Bill created successfully", response);
  }

  @Operation(summary = "Update a bill", description = "Updates details of an existing bill record", responses = {
    @ApiResponse(responseCode = "200", description = "Bill updated successfully"),
    @ApiResponse(responseCode = "404", description = "Bill not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateBill(
    @PathVariable @Parameter(description = "Bill ID") String id,
    @RequestBody @Valid BillRequest request) {
    log.info("REST request to update bill: {}", id);
    BillResponse response = billService.updateBill(id, request);
    return Utils.returnOkResponse(
      "Bill updated successfully", response);
  }

  @Operation(summary = "Delete a bill", description = "Removes a bill record from the system", responses = {
    @ApiResponse(responseCode = "200", description = "Bill deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Bill not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteBill(@PathVariable @Parameter(description = "Bill ID") String id) {
    log.info("REST request to delete bill: {}", id);
    billService.deleteBill(id);
    return Utils.returnOkResponse("Bill deleted successfully", null);
  }

  @Operation(summary = "Get bill by ID", description = "Fetches detailed information of a bill record", responses = {
    @ApiResponse(responseCode = "200", description = "Bill found"),
    @ApiResponse(responseCode = "404", description = "Bill not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getBillById(@PathVariable @Parameter(description = "Bill ID") String id) {
    log.info("REST request to get bill: {}", id);
    BillResponse response = billService.getBillById(id);
    return Utils.returnOkResponse("Bill retrieved successfully", response);
  }

  @Operation(summary = "Get all bills", description = "Retrieves a paginated list of all bill records")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllBills(@PageableDefault Pageable pageable) {
    log.info("REST request to get all bills with pagination: {}", pageable);
    Page<BillResponse> response = billService.getAllBills(pageable);
    return Utils.returnOkResponse("Bills retrieved successfully", response);
  }
}
