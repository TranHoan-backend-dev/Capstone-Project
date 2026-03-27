package com.capstone.customer.service.impl;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.customer.dto.response.BillResponse;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Bill;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.BillRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.ConstructionService;
import com.capstone.customer.service.boundary.CustomerService;
import com.capstone.customer.service.boundary.DeviceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

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

  @Mock
  ConstructionService constructionService;

  @InjectMocks
  BillServiceImpl billService;

  @Test
  @DisplayName("should_ReturnBills_When_RoadmapHasCustomers")
  @SuppressWarnings("unchecked")
  void should_ReturnBills_When_RoadmapHasCustomers() {
    // Arrange
    String roadmapId = "RM_001";
    Pageable pageable = PageRequest.of(0, 10);

    Customer customerMock = mock(Customer.class);
    Bill billMock = mock(Bill.class);
    String customerId = "CUS_001";
    java.util.Stack<Bill> billStack = new java.util.Stack<>();
    billStack.push(billMock);

    when(customerMock.getCustomerId()).thenReturn(customerId);
    when(customerMock.getBills()).thenReturn(billStack);

    when(billMock.getCustomer()).thenReturn(customerMock);
    when(billMock.getBillId()).thenReturn("BILL_001");
    when(billMock.getBillName()).thenReturn("Bill Name");
    when(billMock.getNote()).thenReturn("Note");
    when(billMock.getExportAddress()).thenReturn("Address");

    Page<Customer> customerPage = new PageImpl<>(List.of(customerMock), pageable, 1);

    when(customerRepository.findAll(any(Specification.class), eq(pageable)))
      .thenReturn(customerPage);

    WrapperApiResponse deviceResponse = mock(WrapperApiResponse.class);
    List<Object> usages = List.of(new Object());
    when(deviceResponse.data()).thenReturn(usages);

    when(deviceService.getUsageBatch(anyList())).thenReturn(deviceResponse);

    CustomerResponse customerResponse = mock(CustomerResponse.class);
    when(customerService.getCustomerById(customerId)).thenReturn(customerResponse);

    // Act
    Page<BillResponse> result = billService.getBillsByCustomer(roadmapId, pageable);

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
    String roadmapId = "RM_EMPTY";
    Pageable pageable = PageRequest.of(0, 10);

    when(customerRepository.findAll(any(Specification.class), eq(pageable)))
      .thenReturn(new PageImpl<>(List.of()));

    // Act
    Page<BillResponse> result = billService.getBillsByCustomer(roadmapId, pageable);

    // Assert
    assertNotNull(result);
    assertTrue(result.getContent().isEmpty());
    assertEquals(0, result.getTotalElements());
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
    verify(deviceService, never()).getUsageBatch(any());
  }
}
