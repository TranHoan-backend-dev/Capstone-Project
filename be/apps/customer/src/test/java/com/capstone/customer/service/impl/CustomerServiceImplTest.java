package com.capstone.customer.service.impl;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.exception.NotExistingException;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.ConstructionService;
import com.capstone.customer.service.boundary.DeviceService;
import org.junit.jupiter.api.BeforeEach;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

  @Mock
  private CustomerRepository customerRepository;

  @Mock
  private ConstructionService constructionService;

  @Mock
  private DeviceService deviceService;

  @InjectMocks
  private CustomerServiceImpl customerService;

  private Customer customer;
  private CreateRequest createRequest;
  private UpdateRequest updateRequest;
  private Pageable pageable;

  @BeforeEach
  void setUp() {
    pageable = PageRequest.of(0, 10);
    var now = LocalDateTime.now();
    customer = mock(Customer.class);

    // Mocking common get methods used in mapToResponse
    lenient().when(customer.getCustomerId()).thenReturn("CUST-123");
    lenient().when(customer.getName()).thenReturn("Trần Văn A");
    lenient().when(customer.getEmail()).thenReturn("tranvana@example.com");
    lenient().when(customer.getPhoneNumber()).thenReturn("0901234567");
    lenient().when(customer.getType()).thenReturn(CustomerType.FAMILY);
    lenient().when(customer.getIsBigCustomer()).thenReturn(false);
    lenient().when(customer.getUsageTarget()).thenReturn(UsageTarget.DOMESTIC);
    lenient().when(customer.getNumberOfHouseholds()).thenReturn(1);
    lenient().when(customer.getHouseholdRegistrationNumber()).thenReturn(123456);
    lenient().when(customer.getProtectEnvironmentFee()).thenReturn(1000);
    lenient().when(customer.getIsFree()).thenReturn(false);
    lenient().when(customer.getIsSale()).thenReturn(false);
    lenient().when(customer.getM3Sale()).thenReturn("0");
    lenient().when(customer.getFixRate()).thenReturn("5000");
    lenient().when(customer.getInstallationFee()).thenReturn(1500000);
    lenient().when(customer.getDeductionPeriod()).thenReturn("2023-12");
    lenient().when(customer.getMonthlyRent()).thenReturn(20000);
    lenient().when(customer.getWaterMeterType()).thenReturn("CƠ");
    lenient().when(customer.getCitizenIdentificationNumber()).thenReturn("012345678901");
    lenient().when(customer.getCitizenIdentificationProvideAt()).thenReturn("Cục CSQLHC về TTXH");
    lenient().when(customer.getPaymentMethod()).thenReturn("TIỀN MẶT");
    lenient().when(customer.getBankAccountNumber()).thenReturn("123456789");
    lenient().when(customer.getBankAccountProviderLocation()).thenReturn("Vietcombank");
    lenient().when(customer.getBankAccountName()).thenReturn("TRAN VAN A");
    lenient().when(customer.getBudgetRelationshipCode()).thenReturn("BRC001");
    lenient().when(customer.getPassportCode()).thenReturn("P001");
    lenient().when(customer.getConnectionPoint()).thenReturn("CP001");
    lenient().when(customer.getIsActive()).thenReturn(true);
    lenient().when(customer.getCreatedAt()).thenReturn(now);
    lenient().when(customer.getUpdatedAt()).thenReturn(now);
    lenient().when(customer.getFormNumber()).thenReturn("IF001");
    lenient().when(customer.getWaterPriceId()).thenReturn("WP001");
    lenient().when(customer.getWaterMeterId()).thenReturn("WM001");

    createRequest = new CreateRequest(
      "Trần Văn A", "tranvana@example.com", "0901234567", CustomerType.FAMILY, false,
      UsageTarget.DOMESTIC, 1, 123456, 1000, false, false, "0", "5000",
      1500000, "2023-12", 20000, "CƠ", "012345678901", "Cục CSQLHC về TTXH",
      "TIỀN MẶT", "123456789", "Vietcombank", "TRAN VAN A", "BRC001", "P001",
      "CP001", true, null, "IF001", "FORMCODE-1", "WP001", "WM001"
    );

    updateRequest = new UpdateRequest(
      "Update Name", "update@example.com", "0987654321", CustomerType.COMPANY, true,
      UsageTarget.INDUSTRIAL, 2, 654321, 2000, true, true, "10", "10000",
      2000000, "2024-01", 30000, "ĐIỆN TỬ", "987654321098", "Hà Nội",
      "CHUYỂN KHOẢN", "987654321", "Agribank", "TRAN VAN B", "BRC002", "P002",
      "CP002", true, "Reason", "IF002", "FORMCODE-2", "WP002", "WM002"
    );
  }

  @Test
  @DisplayName("should_CreateCustomer_When_InputIsValid")
  void should_CreateCustomer_When_InputIsValid() {
    // Given
    when(customerRepository.existsByFormCodeAndFormNumber(any(), any())).thenReturn(false);
    when(constructionService.checkExistence(any(), any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterPrice(any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterMeter(any())).thenReturn(true);
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    var response = customerService.createCustomer(createRequest);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.customerId()).isEqualTo("CUST-123");
    verify(customerRepository).save(any(Customer.class));
  }

  @Test
  @DisplayName("should_ThrowException_When_FormExists")
  void should_ThrowException_When_FormExists() {
    when(customerRepository.existsByFormCodeAndFormNumber(any(), any())).thenReturn(true);
    assertThrows(IllegalArgumentException.class, () -> customerService.createCustomer(createRequest));
  }

  @Test
  @DisplayName("should_UpdateCustomer_When_CustomerExists")
  void should_UpdateCustomer_When_CustomerExists() {
    // Given
    var id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(constructionService.checkExistence(any(), any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterPrice(any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterMeter(any())).thenReturn(true);
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    var response = customerService.updateCustomer(id, updateRequest);

    // Then
    assertThat(response).isNotNull();
    verify(customer).setName(updateRequest.name());
    verify(customer).setEmail(updateRequest.email());
    verify(customer).setPhoneNumber(updateRequest.phoneNumber());
    verify(customerRepository).save(customer);
  }

  @Test
  @DisplayName("should_UpdateCustomer_WithNullFields_When_FieldsAreMissing")
  void should_UpdateCustomer_WithNullFields_When_FieldsAreMissing() {
    // Given
    var id = "CUST-123";
    var minimalRequest = new UpdateRequest(
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null
    );
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    customerService.updateCustomer(id, minimalRequest);

    // Then
    verify(customerRepository).save(customer);
    verify(customer, never()).setName(any());
  }

  @Test
  @DisplayName("should_SkipFormCheck_When_OnlyPartiallyProvided")
  void should_SkipFormCheck_When_OnlyPartiallyProvided() {
    // Given
    var id = "CUST-123";
    var partialRequest = new UpdateRequest(
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, "ONLY_CODE", null,
      null, null
    );
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    customerService.updateCustomer(id, partialRequest);

    // Then
    verify(constructionService, never()).checkExistence(any(), any());
    verify(customerRepository).save(customer);
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_FormNotFound")
  void should_ThrowNotExistingException_When_FormNotFound() {
    // Given
    var id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(constructionService.checkExistence(any(), any())).thenReturn(false);

    // When & Then
    assertThrows(NotExistingException.class, () -> customerService.updateCustomer(id, updateRequest));
  }

  @Test
  @DisplayName("should_ThrowException_When_WaterPriceNotFound")
  void should_ThrowException_When_WaterPriceNotFound() {
    // Given
    var id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(constructionService.checkExistence(any(), any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterPrice(any())).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.updateCustomer(id, updateRequest));
  }

  @Test
  @DisplayName("should_ThrowException_When_WaterMeterNotFound")
  void should_ThrowException_When_WaterMeterNotFound() {
    // Given
    var id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(constructionService.checkExistence(any(), any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterPrice(any())).thenReturn(true);
    when(deviceService.checkExistenceOfWaterMeter(any())).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.updateCustomer(id, updateRequest));
  }

  @Test
  @DisplayName("should_ThrowException_When_UpdateNonExistentCustomer")
  void should_ThrowException_When_UpdateNonExistentCustomer() {
    // Given
    var id = "NON-EXISTENT";
    when(customerRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.updateCustomer(id, updateRequest));
  }

  @Test
  @DisplayName("should_DeleteCustomer_When_CustomerExists")
  void should_DeleteCustomer_When_CustomerExists() {
    // Given
    var id = "CUST-123";
    when(customerRepository.existsById(id)).thenReturn(true);

    // When
    customerService.deleteCustomer(id);

    // Then
    verify(customerRepository).deleteById(id);
  }

  @Test
  @DisplayName("should_ThrowException_When_DeleteNonExistentCustomer")
  void should_ThrowException_When_DeleteNonExistentCustomer() {
    // Given
    var id = "NON-EXISTENT";
    when(customerRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.deleteCustomer(id));
  }

  @Test
  @DisplayName("should_ReturnCustomer_When_IdExists")
  void should_ReturnCustomer_When_IdExists() {
    // Given
    var id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));

    // When
    var response = customerService.getCustomerById(id);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.customerId()).isEqualTo(id);
  }

  @Test
  @DisplayName("should_ThrowException_When_GetNonExistentCustomer")
  void should_ThrowException_When_GetNonExistentCustomer() {
    // Given
    var id = "NON-EXISTENT";
    when(customerRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.getCustomerById(id));
  }

  @Test
  @DisplayName("should_ReturnPaginatedCustomers_When_Called")
  void should_ReturnPaginatedCustomers_When_Called() {
    // Given
    Page<Customer> customerPage = new PageImpl<>(List.of(customer));
    when(customerRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(customerPage);

    // When
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable, null);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getContent()).hasSize(1);
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should return paginated customers with search")
  void should_ReturnPaginatedCustomers_When_SearchIsProvided() {
    // Given
    CustomerFilterRequest filter = new CustomerFilterRequest(
      "Trần", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
    );
    Page<Customer> customerPage = new PageImpl<>(List.of(customer));
    when(customerRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(customerPage);

    // When
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable, filter);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getContent()).hasSize(1);
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("should_ReturnTrue_When_PriceIsApplied")
  void should_ReturnTrue_When_PriceIsApplied() {
    // Given
    var priceId = "WP001";
    when(customerRepository.existsByWaterPriceId(priceId)).thenReturn(true);

    // When
    var result = customerService.areCustomersAppliedThisPrice(priceId);

    // Then
    assertThat(result).isTrue();
  }

  @Test
  @DisplayName("should_ReturnFalse_When_PriceIsNotApplied")
  void should_ReturnFalse_When_PriceIsNotApplied() {
    // Given
    var priceId = "WP002";
    when(customerRepository.existsByWaterPriceId(priceId)).thenReturn(false);

    // When
    var result = customerService.areCustomersAppliedThisPrice(priceId);

    // Then
    assertThat(result).isFalse();
  }

  @Test
  @DisplayName("Should return page of customers when roadmap filter is applied")
  void should_ReturnPageOfCustomers_When_RoadmapFilterIsApplied() {
    // Given
    CustomerFilterRequest filter = CustomerFilterRequest.fromRoadmapId("RM_001", "search_key");
    Page<Customer> customerPage = new PageImpl<>(List.of(customer), pageable, 1);

    when(customerRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(customerPage);

    // When
    Page<CustomerResponse> result = customerService.getAllCustomers(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    verify(customerRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("should_ReturnCustomerId_When_MeterIdExists")
  void should_ReturnCustomerId_When_MeterIdExists() {
    // Given
    String meterId = "WM001";
    when(customerRepository.findByWaterMeterId(meterId)).thenReturn(Optional.of(customer));
    when(customer.getCustomerId()).thenReturn("CUST-123");

    // When
    String result = customerService.getIdByMeterId(meterId);

    // Then
    assertThat(result).isEqualTo("CUST-123");
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_MeterIdNotFound")
  void should_ThrowNotExistingException_When_MeterIdNotFound() {
    // Given
    String meterId = "M_UNKNOWN";
    when(customerRepository.findByWaterMeterId(meterId)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(NotExistingException.class, () -> customerService.getIdByMeterId(meterId));
  }
}
