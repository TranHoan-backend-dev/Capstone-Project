package com.capstone.customer.service.impl;

import com.capstone.customer.dto.request.BillRequest;
import com.capstone.customer.dto.response.BillResponse;
import com.capstone.customer.model.Bill;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.BillRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.BillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of BillService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillServiceImpl implements BillService {
    BillRepository billRepository;
    CustomerRepository customerRepository;

    @Override
    @Transactional
    public BillResponse createBill(BillRequest request) {
        log.info("Creating bill for customer ID: {}", request.customerId());
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));

        Bill bill = Bill.create(builder -> builder
                .id(request.customerId())
                .customer(customer)
                .name(request.billName())
                .note(request.note())
                .exportAddress(request.exportAddress()));

        Bill saved = billRepository.save(bill);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BillResponse updateBill(String id, BillRequest request) {
        log.info("Updating bill with ID: {}", id);
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));

        // Note: MapId means billId is same as customerId
        if (!bill.getCustomer().getCustomerId().equals(request.customerId())) {
            Customer newCustomer = customerRepository.findById(request.customerId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));
            bill.setCustomer(newCustomer);
        }

        bill.setBillName(request.billName());
        bill.setNote(request.note());
        bill.setExportAddress(request.exportAddress());

        Bill updated = billRepository.save(bill);
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

    private BillResponse mapToResponse(Bill bill) {
        return new BillResponse(
                bill.getBillId(),
                bill.getBillName(),
                bill.getNote(),
                bill.getExportAddress(),
                bill.getCustomer().getName());
    }
}
