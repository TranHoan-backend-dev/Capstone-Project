package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.BillRequest;
import com.capstone.customer.dto.response.BillResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Bill operations.
 */
public interface BillService {
  /**
   * Creates a new bill / invoice information for a customer.
   *
   * @param request the bill creation request
   * @return the created bill response
   */
  BillResponse createBill(BillRequest request);

  /**
   * Updates existing bill information.
   *
   * @param id      the bill ID (customer ID)
   * @param request the bill update request
   * @return the updated bill response
   */
  BillResponse updateBill(String id, BillRequest request);

  /**
   * Deletes bill information.
   *
   * @param id the bill ID
   */
  void deleteBill(String id);

  /**
   * Retrieves bill information by ID.
   *
   * @param id the bill ID
   * @return the bill response
   */
  BillResponse getBillById(String id);

  /**
   * Retrieves all bills with pagination.
   *
   * @param pageable pagination information
   * @return a page of bill responses
   */
  Page<BillResponse> getAllBills(Pageable pageable);

  /**
   * Retrieves all bills for a specific roadmap this month.
   *
   * @param customerId the customer ID
   * @param pageable   pagination information
   * @return a page of bill/usage data
   */
  Page<BillResponse> getBillsByCustomer(String customerId, Pageable pageable);
}
