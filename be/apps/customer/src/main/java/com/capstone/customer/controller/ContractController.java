package com.capstone.customer.controller;

import com.capstone.customer.dto.request.ContractRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.dto.response.WrapperApiResponse;
import com.capstone.customer.service.boundary.ContractService;
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
 * Controller for managing Water Usage Contracts.
 */
@Slf4j
@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@Tag(name = "Contract Management", description = "Endpoints for managing water usage contracts")
public class ContractController {
    private final ContractService contractService;

    /**
     * Create a new contract.
     * 
     * @param request the contract details
     * @return the created contract
     */
    @Operation(summary = "Create a new contract", description = "Adds a new water usage contract to the system", responses = {
            @ApiResponse(responseCode = "201", description = "Contract created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<WrapperApiResponse> createContract(@RequestBody @Valid ContractRequest request) {
        log.info("REST request to create contract: {}", request.contractId());
        ContractResponse response = contractService.createContract(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Contract created successfully", response, LocalDateTime.now()));
    }

    /**
     * Update an existing contract.
     * 
     * @param id      the contract ID
     * @param request the updated details
     * @return the updated contract
     */
    @Operation(summary = "Update a contract", description = "Updates details of an existing water usage contract", responses = {
            @ApiResponse(responseCode = "200", description = "Contract updated successfully"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> updateContract(
            @PathVariable @Parameter(description = "Contract ID") String id,
            @RequestBody @Valid ContractRequest request) {
        log.info("REST request to update contract: {}", id);
        ContractResponse response = contractService.updateContract(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Contract updated successfully", response, LocalDateTime.now()));
    }

    /**
     * Delete a contract by ID.
     * 
     * @param id the contract ID
     * @return success message
     */
    @Operation(summary = "Delete a contract", description = "Removes a water usage contract from the system", responses = {
            @ApiResponse(responseCode = "200", description = "Contract deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> deleteContract(
            @PathVariable @Parameter(description = "Contract ID") String id) {
        log.info("REST request to delete contract: {}", id);
        contractService.deleteContract(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Contract deleted successfully", null, LocalDateTime.now()));
    }

    /**
     * Get a contract by ID.
     * 
     * @param id the contract ID
     * @return the contract details
     */
    @Operation(summary = "Get contract by ID", description = "Fetches detailed information of a water usage contract", responses = {
            @ApiResponse(responseCode = "200", description = "Contract found"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> getContractById(
            @PathVariable @Parameter(description = "Contract ID") String id) {
        log.info("REST request to get contract: {}", id);
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Contract retrieved successfully", response, LocalDateTime.now()));
    }

    /**
     * Get all contracts with pagination.
     * 
     * @param pageable pagination info
     * @return a page of contracts
     */
    @Operation(summary = "Get all contracts", description = "Retrieves a paginated list of all water usage contracts")
    @GetMapping
    public ResponseEntity<WrapperApiResponse> getAllContracts(@PageableDefault(size = 10) Pageable pageable) {
        log.info("REST request to get all contracts with pagination: {}", pageable);
        Page<ContractResponse> response = contractService.getAllContracts(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Contracts retrieved successfully", response, LocalDateTime.now()));
    }
}
