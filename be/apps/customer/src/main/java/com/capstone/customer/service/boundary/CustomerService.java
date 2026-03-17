package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Customer operations.
 */
public interface CustomerService {
  /**
   * Creates a new customer.
   *
   * @param request the customer creation request
   * @return the created customer response
   */
  CustomerResponse createCustomer(CreateRequest request);

  /**
   * Updates an existing customer.
   *
   * @param id      the customer ID
   * @param request the customer update request
   * @return the updated customer response
   */
  CustomerResponse updateCustomer(String id, CreateRequest request);

  /**
   * Deletes a customer by ID.
   *
   * @param id the customer ID
   */
  void deleteCustomer(String id);

  /**
   * Retrieves a customer by ID.
   *
   * @param id the customer ID
   * @return the customer response
   */
  CustomerResponse getCustomerById(String id);

  /**
   * Retrieves all customers with pagination and optional search.
   *
   * @param pageable pagination information
   * @param search   optional search string
   * @return a page of customer responses
   */
  Page<CustomerResponse> getAllCustomers(Pageable pageable, String search);

  boolean areCustomersAppliedThisPrice(String priceId);
}
