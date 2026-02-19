package com.capstone.customer.controller;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Endpoints for managing customers")
public class CustomerController {
  private final CustomerService customerService;

  @Operation(summary = "Create a new customer", description = "Adds a new customer to the system", responses = {
    @ApiResponse(responseCode = "201", description = "Customer created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createCustomer(@RequestBody @Valid CustomerRequest request) {
    log.info("REST request to create customer: {}", request.email());
    var response = customerService.createCustomer(request);
    return Utils.returnCreatedResponse("Customer created successfully", response);
  }

  @Operation(summary = "Update a customer", description = "Updates details of an existing customer", responses = {
    @ApiResponse(responseCode = "200", description = "Customer updated successfully"),
    @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateCustomer(
    @PathVariable @Parameter(description = "Customer ID") String id,
    @RequestBody @Valid CustomerRequest request) {
    log.info("REST request to update customer: {}", id);
    var response = customerService.updateCustomer(id, request);
    return Utils.returnOkResponse("Customer updated successfully", response);
  }

  @Operation(summary = "Delete a customer", description = "Removes a customer from the system", responses = {
    @ApiResponse(responseCode = "200", description = "Customer deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteCustomer(
    @PathVariable @Parameter(description = "Customer ID") String id) {
    log.info("REST request to delete customer: {}", id);
    customerService.deleteCustomer(id);
    return Utils.returnOkResponse("Customer deleted successfully", null);
  }

  @Operation(summary = "Get customer by ID", description = "Fetches detailed information of a customer", responses = {
    @ApiResponse(responseCode = "200", description = "Customer found"),
    @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getCustomerById(
    @PathVariable @Parameter(description = "Customer ID") String id) {
    log.info("REST request to get customer: {}", id);
    var response = customerService.getCustomerById(id);
    return Utils.returnOkResponse("Customer retrieved successfully", response);
  }

  @Operation(summary = "Get all customers", description = "Retrieves a paginated list of all customers")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllCustomers(@PageableDefault Pageable pageable) {
    log.info("REST request to get all customers with pagination: {}", pageable);
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable);
    return Utils.returnOkResponse("Customers retrieved successfully", response);
  }
}
