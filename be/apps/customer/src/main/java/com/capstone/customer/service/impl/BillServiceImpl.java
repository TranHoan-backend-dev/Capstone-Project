package com.capstone.customer.service.impl;

import com.capstone.customer.dto.request.BillRequest;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.dto.response.BillResponse;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Bill;
import com.capstone.customer.repository.BillRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillServiceImpl implements BillService {
  BillRepository billRepository;
  CustomerRepository customerRepository;
  CustomerService customerService;
  DeviceService deviceService;
  ConstructionService constructionService;

  @Override
  @Transactional
  public BillResponse createBill(BillRequest request) {
    log.info("Creating bill for customer ID: {}", request.customerId());
    var customer = customerRepository.findById(request.customerId())
      .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));

    var bill = Bill.create(builder -> builder
      .id(request.customerId())
      .customer(customer)
      .name(request.billName())
      .note(request.note())
      .exportAddress(request.exportAddress()));

    var saved = billRepository.save(bill);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public BillResponse updateBill(String id, @NonNull BillRequest request) {
    log.info("Updating bill with ID: {}", id);
    var bill = billRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));

    // Note: MapId means billId is same as customerId
    if (!bill.getCustomer().getCustomerId().equals(request.customerId())) {
      var newCustomer = customerRepository.findById(request.customerId())
        .orElseThrow(
          () -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));
      bill.setCustomer(newCustomer);
    }

    bill.setBillName(request.billName());
    bill.setNote(request.note());
    bill.setExportAddress(request.exportAddress());

    var updated = billRepository.save(bill);
    return mapToResponse(updated);
  }

  @Override
  @Transactional
  public void deleteBill(String id) {
    log.info("Deleting bill with ID: {}", id);
    if (!billRepository.existsById(id)) {
      throw new IllegalArgumentException("Bill not found with ID: " + id);
    }
    billRepository.deleteById(id);
  }

  @Override
  public BillResponse getBillById(String id) {
    log.info("Fetching bill with ID: {}", id);
    return billRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));
  }

  @Override
  public Page<BillResponse> getAllBills(Pageable pageable) {
    log.debug("Fetching all bills with pagination: {}", pageable);
    return billRepository.findAll(pageable).map(this::mapToResponse);
  }

  @Override
  public Page<Object> getBillsByRoadmap(String roadmapId, Pageable pageable) {
    log.info("Fetching bills for roadmap: {} this month", roadmapId);
    
    // 1. Get customers for this roadmap
    var filter = CustomerFilterRequest.fromRoadmapId(roadmapId, null);
    Page<CustomerResponse> customers = customerService.getAllCustomers(pageable, filter);

    if (customers.isEmpty()) {
      return new PageImpl<>(List.of(), pageable, 0);
    }

    // 2. Get usage/billing details from device service for these customers
    List<String> customerIds = customers.getContent().stream()
      .map(CustomerResponse::customerId)
      .toList();

    var usageResponse = deviceService.getUsageBatch(customerIds);

    // 3. Return as a page (preserving the pagination from customers)
    return new PageImpl<>((List<Object>) usageResponse.data(), pageable, customers.getTotalElements());
  }

  private BillResponse mapToResponse(@NonNull Bill bill) {
    return new BillResponse(
      bill.getBillId(),
      bill.getBillName(),
      bill.getNote(),
      bill.getExportAddress(),
      bill.getCustomer().getName());
  }
}
