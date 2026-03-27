package com.capstone.customer.controller;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.service.boundary.CustomerService;
import org.jspecify.annotations.NonNull;
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
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

  @Mock
  private CustomerService customerService;

  @Mock
  private Logger log;

  @InjectMocks
  private CustomerController customerController;

  private CreateRequest createRequest;
  private UpdateRequest updateRequest;
  private CustomerResponse customerResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(customerController, "log", log);

    createRequest = mock(CreateRequest.class);
    updateRequest = mock(UpdateRequest.class);
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
    when(customerService.updateCustomer(eq(id), any(UpdateRequest.class))).thenReturn(customerResponse);

    ResponseEntity<WrapperApiResponse> response = customerController.updateCustomer(id, updateRequest);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().message()).isEqualTo("Cập nhật khách hàng thành công");
    assertThat(response.getBody().data()).isEqualTo(customerResponse);

    verify(customerService).updateCustomer(id, updateRequest);
  }

  @Test
  @DisplayName("should_ThrowException_When_UpdateCustomer_ServiceThrowsException")
  void should_ThrowException_When_UpdateCustomer_ServiceThrowsException() {
    String id = "uuid-123";
    when(customerService.updateCustomer(eq(id), any(UpdateRequest.class)))
      .thenThrow(new IllegalArgumentException("Customer not found"));

    assertThrows(IllegalArgumentException.class, () -> customerController.updateCustomer(id, updateRequest));

    verify(customerService).updateCustomer(id, updateRequest);
  }

  @Test
  @DisplayName("should_ReturnOk_When_DeleteCustomer_IsSuccessful")
  void should_ReturnOk_When_DeleteCustomer_IsSuccessful() {
    String id = "uuid-123";
    doNothing().when(customerService).deleteCustomer(id);

    ResponseEntity<WrapperApiResponse> response = customerController.deleteCustomer(id);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(Objects.requireNonNull(response.getBody()).message()).isEqualTo("Xóa khách hàng thành công");

    verify(customerService).deleteCustomer(id);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetCustomerById_IsSuccessful")
  void should_ReturnOk_When_GetCustomerById_IsSuccessful() {
    String id = "uuid-123";
    when(customerService.getCustomerById(id)).thenReturn(customerResponse);

    ResponseEntity<WrapperApiResponse> response = customerController.getCustomerById(id);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(Objects.requireNonNull(response.getBody()).data()).isEqualTo(customerResponse);
    assertThat(response.getBody().message()).isEqualTo("Lấy thông tin khách hàng thành công");

    verify(customerService).getCustomerById(id);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetAllCustomers_IsSuccessful")
  void should_ReturnOk_When_GetAllCustomers_IsSuccessful() {
    Pageable pageable = PageRequest.of(0, 10);
    Page<CustomerResponse> page = new PageImpl<>(List.of(customerResponse));
    when(customerService.getAllCustomers(eq(pageable), any(CustomerFilterRequest.class))).thenReturn(page);

    ResponseEntity<WrapperApiResponse> response = customerController.getAllCustomers(pageable, null);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(Objects.requireNonNull(response.getBody()).data()).isEqualTo(page);
    assertThat(response.getBody().message()).isEqualTo("Lấy danh sách khách hàng thành công");

    verify(customerService).getAllCustomers(eq(pageable), any());
  }

  @Test
  @DisplayName("should_ReturnOk_When_CheckWhetherCustomersAreApplied_IsSuccessful")
  void should_ReturnOk_When_CheckWhetherCustomersAreApplied_IsSuccessful() {
    String waterPriceId = "price-123";
    when(customerService.areCustomersAppliedThisPrice(waterPriceId)).thenReturn(true);

    @SuppressWarnings("unchecked")
    ResponseEntity<WrapperApiResponse> response = (ResponseEntity<WrapperApiResponse>) customerController.checkWhetherCustomersAreApplied(waterPriceId);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().message()).isEqualTo("Kiểm tra thành công");
    assertThat(response.getBody().data()).isEqualTo(true);
    verify(customerService).areCustomersAppliedThisPrice(waterPriceId);
  }

  @Test
  @DisplayName("should_ReturnBoolean_When_CheckExistenceOfCustomer_IsSuccessful")
  void should_ReturnBoolean_When_CheckExistenceOfCustomer_IsSuccessful() {
    String id = "uuid-123";
    when(customerService.isExistingCustomer(id)).thenReturn(true);

    boolean result = customerController.checkExistenceOfCustomer(id);

    assertThat(result).isTrue();
    verify(customerService).isExistingCustomer(id);
  }

  @Test
  @DisplayName("should_ReturnId_When_GetCustomerIdByMeterId_IsSuccessful")
  void should_ReturnId_When_GetCustomerIdByMeterId_IsSuccessful() {
    String meterId = "meter-123";
    String expectedId = "uuid-123";
    when(customerService.getIdByMeterId(meterId)).thenReturn(expectedId);

    String result = customerController.getCustomerIdByMeterId(meterId);

    assertThat(result).isEqualTo(expectedId);
    verify(customerService).getIdByMeterId(meterId);
  }
}
