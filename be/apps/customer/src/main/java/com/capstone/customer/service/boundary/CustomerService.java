package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;

public interface CustomerService {
  CustomerResponse createCustomer(CreateRequest request);

  CustomerResponse updateCustomer(String id, UpdateRequest request);

  void deleteCustomer(String id);

  CustomerResponse getCustomerById(String id);

  Page<CustomerResponse> getAllCustomers(Pageable pageable, CustomerFilterRequest filter);

  boolean areCustomersAppliedThisPrice(String priceId);

  boolean isExistingCustomer(String id);

  String getIdByMeterId(String meterId);

  int countCustomersOfRoadmap(String roadmapId);
}
