package com.capstone.customer.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.CustomerRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.service.boundary.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Endpoints for managing customers")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
  CustomerService customerService;
  @NonFinal
  Logger log;

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createCustomer(@RequestBody @Valid CustomerRequest request) {
    log.info("REST request to create customer: {}", request.email());
    var response = customerService.createCustomer(request);
    log.info("New customer created: {}", response);
    return Utils.returnCreatedResponse("Customer created successfully");
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateCustomer(
    @PathVariable @Parameter(description = "") String id,
    @RequestBody @Valid CustomerRequest request) {
    log.info("REST request to update customer: {}", id);
    var response = customerService.updateCustomer(id, request);
    return Utils.returnOkResponse("", response);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteCustomer(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to delete customer: {}", id);
    customerService.deleteCustomer(id);
    return Utils.returnOkResponse("Customer deleted successfully", null);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "404", description = "")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getCustomerById(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to get customer: {}", id);
    var response = customerService.getCustomerById(id);
    return Utils.returnOkResponse("Customer retrieved successfully", response);
  }

  @Operation(summary = "", description = "")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllCustomers(@PageableDefault Pageable pageable) {
    log.info("REST request to get all customers with pagination: {}", pageable);
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable);
    return Utils.returnOkResponse("Customers retrieved successfully", response);
  }

  @Operation(hidden = true)
  @GetMapping("/water-price/{price}")
  public ResponseEntity<?> checkWhetherCustomersAreApplied(@PathVariable("price") @NonNull String waterPriceId) {
    log.info("REST request to check whether customers applied: {}", waterPriceId);
    var response = customerService.areCustomersAppliedThisPrice(waterPriceId);
    log.info("Customer applied: {}", response);
    return Utils.returnOkResponse("Check successfully", response);
  }
}
