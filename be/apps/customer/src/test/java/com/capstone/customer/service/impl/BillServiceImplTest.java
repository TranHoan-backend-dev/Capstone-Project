package com.capstone.customer.service.impl;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.dto.response.CustomerResponse;
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
  void should_ReturnBills_When_RoadmapHasCustomers() {
    // Arrange
    String roadmapId = "RM_001";
    Pageable pageable = PageRequest.of(0, 10);
    
    CustomerResponse customer = mock(CustomerResponse.class);
    when(customer.customerId()).thenReturn("CUS_001");
    Page<CustomerResponse> customerPage = new PageImpl<>(List.of(customer), pageable, 1);
    
    when(customerService.getAllCustomers(eq(pageable), any(CustomerFilterRequest.class)))
      .thenReturn(customerPage);
      
    WrapperApiResponse deviceResponse = mock(WrapperApiResponse.class);
    List<Object> usages = List.of(new Object());
    when(deviceResponse.data()).thenReturn(usages);
    
    when(deviceService.getUsageBatch(anyList())).thenReturn(deviceResponse);

    // Act
    Page<Object> result = billService.getBillsByRoadmap(roadmapId, pageable);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getContent().size());
    assertEquals(1, result.getTotalElements());
    verify(customerService).getAllCustomers(eq(pageable), any(CustomerFilterRequest.class));
    verify(deviceService).getUsageBatch(List.of("CUS_001"));
  }

  @Test
  @DisplayName("should_ReturnEmptyPage_When_RoadmapHasNoCustomers")
  void should_ReturnEmptyPage_When_RoadmapHasNoCustomers() {
    // Arrange
    String roadmapId = "RM_EMPTY";
    Pageable pageable = PageRequest.of(0, 10);
    
    when(customerService.getAllCustomers(eq(pageable), any(CustomerFilterRequest.class)))
      .thenReturn(new PageImpl<>(List.of()));

    // Act
    Page<Object> result = billService.getBillsByRoadmap(roadmapId, pageable);

    // Assert
    assertNotNull(result);
    assertTrue(result.getContent().isEmpty());
    assertEquals(0, result.getTotalElements());
    verify(customerService).getAllCustomers(eq(pageable), any(CustomerFilterRequest.class));
    verify(deviceService, never()).getUsageBatch(any());
  }
}
