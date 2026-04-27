package com.capstone.customer.service.impl;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Bill;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.BillRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.CustomerService;
import com.capstone.customer.service.boundary.DeviceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Stack;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BillServiceImplTest {

  @Mock
  BillRepository billRepository;

  @Mock
  CustomerRepository customerRepository;

  @Mock
  CustomerService customerService;

  @Mock
  DeviceService deviceService;

  @InjectMocks
  BillServiceImpl billService;

  @Test
  @DisplayName("should_CreateBill_When_InputIsValid")
  void should_CreateBill_When_InputIsValid() {
    var customerId = "CUS_001";
    var request = new com.capstone.customer.dto.request.BillRequest(customerId, "Bill Name", "Note", "Address");
    var customer = mock(Customer.class);
    var bill = mock(Bill.class);

    when(customerRepository.findById(customerId)).thenReturn(java.util.Optional.of(customer));
    when(customer.getCustomerId()).thenReturn(customerId);
    when(billRepository.save(any())).thenReturn(bill);
    when(bill.getCustomer()).thenReturn(customer);
    when(bill.getPayDate()).thenReturn(java.time.LocalDate.now());

    // Mock for mapToResponse
    var usageResponse = mock(WrapperApiResponse.class);
    when(deviceService.getUsageBatch(anyList())).thenReturn(usageResponse);
    when(customerService.getCustomerById(anyString())).thenReturn(mock(CustomerResponse.class));

    var result = billService.createBill(request);

    assertNotNull(result);
    verify(billRepository).save(any());
  }

  @Test
  @DisplayName("should_UpdateBill_When_BillExists")
  void should_UpdateBill_When_BillExists() {
    var id = "BILL_001";
    var customerId = "CUS_001";
    var request = new com.capstone.customer.dto.request.BillRequest(customerId, "New Name", "New Note", "New Address");
    var bill = mock(Bill.class);
    var customer = mock(Customer.class);

    when(billRepository.findById(id)).thenReturn(java.util.Optional.of(bill));
    when(bill.getCustomer()).thenReturn(customer);
    when(customer.getCustomerId()).thenReturn(customerId);
    when(billRepository.save(any())).thenReturn(bill);
    when(bill.getPayDate()).thenReturn(java.time.LocalDate.now());

    // Mock for mapToResponse
    var usageResponse = mock(WrapperApiResponse.class);
    when(deviceService.getUsageBatch(anyList())).thenReturn(usageResponse);
    when(customerService.getCustomerById(anyString())).thenReturn(mock(CustomerResponse.class));

    var result = billService.updateBill(id, request);

    assertNotNull(result);
    verify(bill).setBillName("New Name");
    verify(billRepository).save(bill);
  }

  @Test
  @DisplayName("should_DeleteBill_When_BillExists")
  void should_DeleteBill_When_BillExists() {
    var id = "BILL_001";
    when(billRepository.existsById(id)).thenReturn(true);
    billService.deleteBill(id);
    verify(billRepository).deleteById(id);
  }

  @Test
  @DisplayName("should_GetBillById_When_BillExists")
  void should_GetBillById_When_BillExists() {
    var id = "BILL_001";
    var bill = mock(Bill.class);
    var customer = mock(Customer.class);
    when(billRepository.findById(id)).thenReturn(java.util.Optional.of(bill));
    when(bill.getCustomer()).thenReturn(customer);
    when(customer.getCustomerId()).thenReturn("CUS1");
    when(bill.getPayDate()).thenReturn(java.time.LocalDate.now());

    // Mock for mapToResponse
    var usageResponse = mock(WrapperApiResponse.class);
    when(deviceService.getUsageBatch(anyList())).thenReturn(usageResponse);
    when(customerService.getCustomerById(anyString())).thenReturn(mock(CustomerResponse.class));

    var result = billService.getBillById(id);

    assertNotNull(result);
    verify(billRepository).findById(id);
  }

  @Test
  @DisplayName("should_ReturnBills_When_RoadmapHasCustomers")
  @SuppressWarnings("unchecked")
  void should_ReturnBills_When_RoadmapHasCustomers() {
    // Arrange
    var roadmapId = "RM_001";
    var pageable = PageRequest.of(0, 10);

    var customerMock = mock(Customer.class);
    var billMock = mock(Bill.class);
    var customerId = "CUS_001";
    Stack<Bill> billStack = new Stack<>();
    billStack.push(billMock);

    when(customerMock.getCustomerId()).thenReturn(customerId);
    when(customerMock.getBills()).thenReturn(billStack);

    when(billMock.getCustomer()).thenReturn(customerMock);
    when(billMock.getBillId()).thenReturn("BILL_001");
    when(billMock.getBillName()).thenReturn("Bill Name");
    when(billMock.getNote()).thenReturn("Note");
    when(billMock.getExportAddress()).thenReturn("Address");

    var customerPage = new PageImpl<>(List.of(customerMock), pageable, 1);

    when(customerRepository.findAll(any(Specification.class), eq(pageable)))
      .thenReturn(customerPage);

    var deviceResponse = mock(WrapperApiResponse.class);
    List<Object> usages = List.of(new Object());
    when(deviceResponse.data()).thenReturn(usages);

    when(deviceService.getUsageBatch(anyList())).thenReturn(deviceResponse);

    var customerResponse = mock(CustomerResponse.class);
    when(customerService.getCustomerById(customerId)).thenReturn(customerResponse);

    // Act
    var result = billService.getBillsByCustomer(roadmapId, pageable);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getContent().size());
    assertEquals(1, result.getTotalElements());
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
    verify(deviceService).getUsageBatch(List.of(customerId));
    verify(customerService).getCustomerById(customerId);
  }

  @Test
  @DisplayName("should_ReturnEmptyPage_When_RoadmapHasNoCustomers")
  @SuppressWarnings("unchecked")
  void should_ReturnEmptyPage_When_RoadmapHasNoCustomers() {
    // Arrange
    var roadmapId = "RM_EMPTY";
    var pageable = PageRequest.of(0, 10);

    when(customerRepository.findAll(any(Specification.class), eq(pageable)))
      .thenReturn(new PageImpl<>(List.of()));

    // Act
    var result = billService.getBillsByCustomer(roadmapId, pageable);

    // Assert
    assertNotNull(result);
    assertTrue(result.getContent().isEmpty());
    assertEquals(0, result.getTotalElements());
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
    verify(deviceService, never()).getUsageBatch(any());
  }
}
