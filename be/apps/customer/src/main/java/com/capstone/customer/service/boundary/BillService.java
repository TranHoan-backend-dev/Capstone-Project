package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.BillRequest;
import com.capstone.customer.dto.response.BillResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BillService {
  BillResponse createBill(BillRequest request);

  BillResponse updateBill(String id, BillRequest request);

  void deleteBill(String id);

  BillResponse getBillById(String id);

  Page<BillResponse> getAllBills(Pageable pageable);

  Page<BillResponse> getBillsByCustomer(String customerId, Pageable pageable);
}
