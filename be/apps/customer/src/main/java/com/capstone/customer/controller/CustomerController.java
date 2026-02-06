package com.capstone.customer.controller;

import com.capstone.customer.dto.request.CustomerRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.service.boundary.CustomerService;
import com.capstone.customer.dto.response.WrapperApiResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller for managing Customer data.
 */
@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Endpoints for managing customers")
public class CustomerController {
  private final CustomerService customerService;

  /**
   * Create a new customer.
   * 
   * @param request the customer details
   * @return the created customer
   */
  @Operation(summary = "Create a new customer", description = "Adds a new customer to the system", responses = {
      @ApiResponse(responseCode = "201", description = "Customer created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createCustomer(@RequestBody @Valid CustomerRequest request) {
    log.info("REST request to create customer: {}", request.email());
    CustomerResponse response = customerService.createCustomer(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
        HttpStatus.CREATED.value(), "Customer created successfully", response, LocalDateTime.now()));
  }

  /**
   * Update an existing customer.
   * 
   * @param id      the customer ID
   * @param request the updated details
   * @return the updated customer
   */
  @Operation(summary = "Update a customer", description = "Updates details of an existing customer", responses = {
      @ApiResponse(responseCode = "200", description = "Customer updated successfully"),
      @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateCustomer(
      @PathVariable @Parameter(description = "Customer ID") String id,
      @RequestBody @Valid CustomerRequest request) {
    log.info("REST request to update customer: {}", id);
    CustomerResponse response = customerService.updateCustomer(id, request);
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(), "Customer updated successfully", response, LocalDateTime.now()));
  }

  /**
   * Delete a customer.
   * 
   * @param id the customer ID
   * @return success message
   */
  @Operation(summary = "Delete a customer", description = "Removes a customer from the system", responses = {
      @ApiResponse(responseCode = "200", description = "Customer deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteCustomer(
      @PathVariable @Parameter(description = "Customer ID") String id) {
    log.info("REST request to delete customer: {}", id);
    customerService.deleteCustomer(id);
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(), "Customer deleted successfully", null, LocalDateTime.now()));
  }

  /**
   * Get a customer by ID.
   * 
   * @param id the customer ID
   * @return the customer details
   */
  @Operation(summary = "Get customer by ID", description = "Fetches detailed information of a customer", responses = {
      @ApiResponse(responseCode = "200", description = "Customer found"),
      @ApiResponse(responseCode = "404", description = "Customer not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getCustomerById(
      @PathVariable @Parameter(description = "Customer ID") String id) {
    log.info("REST request to get customer: {}", id);
    CustomerResponse response = customerService.getCustomerById(id);
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(), "Customer retrieved successfully", response, LocalDateTime.now()));
  }

  /**
   * Get all customers with pagination.
   * 
   * @param pageable pagination info
   * @return a page of customers
   */
  @Operation(summary = "Get all customers", description = "Retrieves a paginated list of all customers")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllCustomers(@PageableDefault(size = 10) Pageable pageable) {
    log.info("REST request to get all customers with pagination: {}", pageable);
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable);
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(), "Customers retrieved successfully", response, LocalDateTime.now()));
  }
}
