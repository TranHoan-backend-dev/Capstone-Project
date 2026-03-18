package com.capstone.customer.controller;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.service.boundary.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

  @Mock
  private CustomerService customerService;

  @Mock
  private Logger log;

  @InjectMocks
  private CustomerController customerController;

  private CreateRequest createRequest;
  private CustomerResponse customerResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(customerController, "log", log);

    createRequest = mock(CreateRequest.class);
    customerResponse = mock(CustomerResponse.class);
  }

  @Test
  @DisplayName("should_ReturnCreated_When_CreateCustomer_IsSuccessful")
  void should_ReturnCreated_When_CreateCustomer_IsSuccessful() {
    when(createRequest.email()).thenReturn("test@example.com");
    when(customerService.createCustomer(any(CreateRequest.class))).thenReturn(customerResponse);

    ResponseEntity<WrapperApiResponse> response = customerController.createCustomer(createRequest);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().message()).isEqualTo("Tạo khách hàng thành công");
    
    verify(customerService).createCustomer(createRequest);
    verify(log).info("REST request to create customer: {}", "test@example.com");
  }

  @Test
  @DisplayName("should_ReturnOk_When_UpdateCustomer_IsSuccessful")
  void should_ReturnOk_When_UpdateCustomer_IsSuccessful() {
    String id = "uuid-123";
    when(customerService.updateCustomer(eq(id), any(CreateRequest.class))).thenReturn(customerResponse);

    ResponseEntity<WrapperApiResponse> response = customerController.updateCustomer(id, createRequest);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().message()).isEqualTo("Cập nhật khách hàng thành công");
    
    verify(customerService).updateCustomer(id, createRequest);
  }

  @Test
  @DisplayName("should_ReturnOk_When_DeleteCustomer_IsSuccessful")
  void should_ReturnOk_When_DeleteCustomer_IsSuccessful() {
    String id = "uuid-123";
    doNothing().when(customerService).deleteCustomer(id);

    ResponseEntity<WrapperApiResponse> response = customerController.deleteCustomer(id);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody().message()).isEqualTo("Xóa khách hàng thành công");
    
    verify(customerService).deleteCustomer(id);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetCustomerById_IsSuccessful")
  void should_ReturnOk_When_GetCustomerById_IsSuccessful() {
    String id = "uuid-123";
    when(customerService.getCustomerById(id)).thenReturn(customerResponse);

    ResponseEntity<WrapperApiResponse> response = customerController.getCustomerById(id);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody().data()).isEqualTo(customerResponse);
    assertThat(response.getBody().message()).isEqualTo("Lấy thông tin khách hàng thành công");
    
    verify(customerService).getCustomerById(id);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetAllCustomers_IsSuccessful")
  void should_ReturnOk_When_GetAllCustomers_IsSuccessful() {
    Pageable pageable = PageRequest.of(0, 10);
    Page<CustomerResponse> page = new PageImpl<>(List.of(customerResponse));
    when(customerService.getAllCustomers(pageable, null)).thenReturn(page);

    ResponseEntity<WrapperApiResponse> response = customerController.getAllCustomers(pageable, null);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody().data()).isEqualTo(page);
    assertThat(response.getBody().message()).isEqualTo("Lấy danh sách khách hàng thành công");
    
    verify(customerService).getAllCustomers(pageable, null);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetAllCustomersWithSearch_IsSuccessful")
  void should_ReturnOk_When_GetAllCustomersWithSearch_IsSuccessful() {
    Pageable pageable = PageRequest.of(0, 10);
    CustomerFilterRequest filter = new CustomerFilterRequest(
      "test", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
    );
    Page<CustomerResponse> page = new PageImpl<>(List.of(customerResponse));
    when(customerService.getAllCustomers(pageable, filter)).thenReturn(page);

    ResponseEntity<WrapperApiResponse> response = customerController.getAllCustomers(pageable, filter);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody().data()).isEqualTo(page);
    assertThat(response.getBody().message()).isEqualTo("Lấy danh sách khách hàng thành công");

    verify(customerService).getAllCustomers(pageable, filter);
  }

  @Test
  @DisplayName("should_ReturnOk_When_CheckWhetherCustomersAreApplied_IsSuccessful")
  void should_ReturnOk_When_CheckWhetherCustomersAreApplied_IsSuccessful() {
    String waterPriceId = "price-123";
    when(customerService.areCustomersAppliedThisPrice(waterPriceId)).thenReturn(true);

    ResponseEntity<?> response = customerController.checkWhetherCustomersAreApplied(waterPriceId);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    verify(customerService).areCustomersAppliedThisPrice(waterPriceId);
  }
}
@Test
@DisplayName("should_ReturnOk_When_GetCustomerById_WithValidId_IsSuccessful")
void should_ReturnOk_When_GetCustomerById_WithValidId_IsSuccessful() {
  String validId = customerId;
  CustomerResponse mockResponse = new CustomerResponse(
    validId, "Test Customer", "test@example.com", "0123456789", "FAMILY",
    false, false, false, false, "0", "20000", "DOMESTIC", 4, null,
    1000000, 50000, "CASH", "123456789", "Vietcombank", "TEST USER",
    "BC001", "P001", "CP001", "MECHANICAL", "M001", "P100",
    true, LocalDateTime.now(), LocalDateTime.now(), "FORM001"
  );
  when(customerService.getCustomerById(validId)).thenReturn(mockResponse);

  ResponseEntity<WrapperApiResponse> response = customerController.getCustomerById(validId);

  assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  assertThat(response.getBody().data()).isNotNull();
  assertThat(response.getBody().message()).isEqualTo("Lấy thông tin khách hàng thành công");
  verify(customerService).getCustomerById(validId);
}

@Test
@DisplayName("should_ReturnNotFound_When_GetCustomerById_WithInvalidId")
void should_ReturnNotFound_When_GetCustomerById_WithInvalidId() {
  String invalidId = "INVALID_ID";
  when(customerService.getCustomerById(invalidId))
    .thenThrow(new RuntimeException("Customer not found"));

  assertThrows(RuntimeException.class, () -> customerController.getCustomerById(invalidId));
  verify(customerService).getCustomerById(invalidId);
}

@Test
@DisplayName("should_ReturnOk_When_GetCustomerById_WithUuidFormat")
void should_ReturnOk_When_GetCustomerById_WithUuidFormat() {
  String uuidId = UUID.randomUUID().toString();
  when(customerService.getCustomerById(uuidId)).thenReturn(customerResponse);

  ResponseEntity<WrapperApiResponse> response = customerController.getCustomerById(uuidId);

  assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  verify(customerService).getCustomerById(uuidId);
}