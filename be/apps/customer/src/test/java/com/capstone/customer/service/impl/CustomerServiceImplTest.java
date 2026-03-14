package com.capstone.customer.service.impl;

import com.capstone.common.enumerate.UsageTarget;
import com.capstone.customer.dto.request.CustomerRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.CustomerRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

  @Mock
  private CustomerRepository customerRepository;

  @InjectMocks
  private CustomerServiceImpl customerService;

  private Customer customer;
  private CustomerRequest customerRequest;
  private Pageable pageable;
  private LocalDateTime now;

  @BeforeEach
  void setUp() {
    pageable = PageRequest.of(0, 10);
    now = LocalDateTime.now();
    customer = mock(Customer.class);
    
    // Mocking common get methods used in mapToResponse
    lenient().when(customer.getCustomerId()).thenReturn("CUST-123");
    lenient().when(customer.getName()).thenReturn("Trần Văn A");
    lenient().when(customer.getEmail()).thenReturn("tranvana@example.com");
    lenient().when(customer.getPhoneNumber()).thenReturn("0901234567");
    lenient().when(customer.getType()).thenReturn("CÁ NHÂN");
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
    lenient().when(customer.getInstallationFormId()).thenReturn("IF001");
    lenient().when(customer.getWaterPriceId()).thenReturn("WP001");
    lenient().when(customer.getWaterMeterId()).thenReturn("WM001");

    customerRequest = new CustomerRequest(
      "Trần Văn A", "tranvana@example.com", "0901234567", "CÁ NHÂN", false,
      UsageTarget.DOMESTIC, 1, 123456, 1000, false, false, "0", "5000",
      1500000, "2023-12", 20000, "CƠ", "012345678901", "Cục CSQLHC về TTXH",
      "TIỀN MẶT", "123456789", "Vietcombank", "TRAN VAN A", "BRC001", "P001",
      "CP001", true, null, "IF001", "WP001", "WM001"
    );
  }

  @Test
  @DisplayName("Should create customer successfully")
  void should_CreateCustomer_When_InputIsValid() {
    // Given
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    CustomerResponse response = customerService.createCustomer(customerRequest);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.customerId()).isEqualTo("CUST-123");
    verify(customerRepository).save(any(Customer.class));
  }

  @Test
  @DisplayName("Should create customer with default active status when isActive is null")
  void should_CreateCustomerWithDefaultActiveStatus_When_IsActiveIsNull() {
    // Given
    CustomerRequest requestWithNullActive = new CustomerRequest(
      "Trần Văn A", "tranvana@example.com", "0901234567", "CÁ NHÂN", false,
      UsageTarget.DOMESTIC, 1, 123456, 1000, false, false, "0", "5000",
      1500000, "2023-12", 20000, "CƠ", "012345678901", "Cục CSQLHC về TTXH",
      "TIỀN MẶT", "123456789", "Vietcombank", "TRAN VAN A", "BRC001", "P001",
      "CP001", null, null, "IF001", "WP001", "WM001"
    );
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    customerService.createCustomer(requestWithNullActive);

    // Then
    verify(customerRepository).save(argThat(c -> c.getIsActive() != null && c.getIsActive()));
  }

  @Test
  @DisplayName("Should update customer successfully")
  void should_UpdateCustomer_When_CustomerExists() {
    // Given
    String id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
    when(customerRepository.save(any(Customer.class))).thenReturn(customer);

    // When
    CustomerResponse response = customerService.updateCustomer(id, customerRequest);

    // Then
    assertThat(response).isNotNull();
    verify(customer).setName(customerRequest.name());
    verify(customerRepository).save(customer);
  }

  @Test
  @DisplayName("Should throw exception when updating non-existent customer")
  void should_ThrowException_When_UpdateNonExistentCustomer() {
    // Given
    String id = "NON-EXISTENT";
    when(customerRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.updateCustomer(id, customerRequest));
  }

  @Test
  @DisplayName("Should delete customer successfully")
  void should_DeleteCustomer_When_CustomerExists() {
    // Given
    String id = "CUST-123";
    when(customerRepository.existsById(id)).thenReturn(true);

    // When
    customerService.deleteCustomer(id);

    // Then
    verify(customerRepository).deleteById(id);
  }

  @Test
  @DisplayName("Should throw exception when deleting non-existent customer")
  void should_ThrowException_When_DeleteNonExistentCustomer() {
    // Given
    String id = "NON-EXISTENT";
    when(customerRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.deleteCustomer(id));
  }

  @Test
  @DisplayName("Should return customer by ID when exists")
  void should_ReturnCustomer_When_IdExists() {
    // Given
    String id = "CUST-123";
    when(customerRepository.findById(id)).thenReturn(Optional.of(customer));

    // When
    CustomerResponse response = customerService.getCustomerById(id);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.customerId()).isEqualTo(id);
  }

  @Test
  @DisplayName("Should throw exception when fetching non-existent customer")
  void should_ThrowException_When_GetNonExistentCustomer() {
    // Given
    String id = "NON-EXISTENT";
    when(customerRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> customerService.getCustomerById(id));
  }

  @Test
  @DisplayName("Should return paginated customers")
  void should_ReturnPaginatedCustomers_When_Called() {
    // Given
    Page<Customer> customerPage = new PageImpl<>(List.of(customer));
    when(customerRepository.findAll(pageable)).thenReturn(customerPage);

    // When
    Page<CustomerResponse> response = customerService.getAllCustomers(pageable);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getContent()).hasSize(1);
    verify(customerRepository).findAll(pageable);
  }

  @Test
  @DisplayName("Should return true when customers are applied this price")
  void should_ReturnTrue_When_PriceIsApplied() {
    // Given
    String priceId = "WP001";
    when(customerRepository.existsByWaterPriceId(priceId)).thenReturn(true);

    // When
    boolean result = customerService.areCustomersAppliedThisPrice(priceId);

    // Then
    assertThat(result).isTrue();
  }

  @Test
  @DisplayName("Should return false when no customers are applied this price")
  void should_ReturnFalse_When_PriceIsNotApplied() {
    // Given
    String priceId = "WP002";
    when(customerRepository.existsByWaterPriceId(priceId)).thenReturn(false);

    // When
    boolean result = customerService.areCustomersAppliedThisPrice(priceId);

    // Then
    assertThat(result).isFalse();
  }
}
