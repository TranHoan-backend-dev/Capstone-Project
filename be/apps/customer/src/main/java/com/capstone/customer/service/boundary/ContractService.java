package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for managing Water Usage Contract operations.
 */
public interface ContractService {
    /**
     * Creates a new water usage contract.
     *
     * @param request the contract creation request
     * @return the created contract response
     */
    ContractResponse createContract(CreateRequest request);

    /**
     * Deletes a contract by ID.
     *
     * @param id the contract ID
     */
    void deleteContract(String id);

    /**
     * Retrieves a contract by ID.
     *
     * @param id the contract ID
     * @return the contract response
     */
    ContractResponse getContractById(String id);

    /**
     * Retrieves all contracts with pagination and filtering.
     *
     * @param pageable pagination information
     * @param request filtering parameters including keyword search and field-specific filters
     * @return a page of contract responses
     */
    Page<ContractResponse> getAllContracts(Pageable pageable, ContractFilterRequest request);

    /**
     * Retrieves a list of contract IDs based on formCode and formNumber.
     *
     * @param formCode form code
     * @param formNumber form number
     * @return a list of contract IDs
     */
    List<String> findContractIdsByFormCodeAndFormNumber(String formCode, String formNumber);
}
