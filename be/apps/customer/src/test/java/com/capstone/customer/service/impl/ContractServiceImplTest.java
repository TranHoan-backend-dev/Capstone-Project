package com.capstone.customer.service.impl;

import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.model.WaterUsageContract;
import com.capstone.customer.repository.ContractRepository;
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
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceImplTest {

  @Mock
  private ContractRepository contractRepository;

  @Mock
  private CustomerRepository customerRepository;

  @InjectMocks
  private ContractServiceImpl contractService;

  private Pageable pageable;
  private WaterUsageContract contract;
  private Customer customer;
  private LocalDateTime now;

  @BeforeEach
  void setUp() {
    pageable = PageRequest.of(0, 10);
    customer = mock(Customer.class);
    when(customer.getName()).thenReturn("Test Customer");
    when(customer.getCustomerId()).thenReturn("CUST001");

    now = LocalDateTime.now();
    contract = mock(WaterUsageContract.class);
    lenient().when(contract.getContractId()).thenReturn("CON001");
    lenient().when(contract.getCustomer()).thenReturn(customer);
    lenient().when(contract.getFormCode()).thenReturn("INST001");
    lenient().when(contract.getCreatedAt()).thenReturn(now);
    lenient().when(contract.getUpdatedAt()).thenReturn(now);
    lenient().when(contract.getRepresentative()).thenReturn(Collections.emptyList());
  }

//  @Test
//  @DisplayName("Should create contract successfully")
//  void should_CreateContract_When_InputIsValid() {
//    // Given
//    var request = new CreateRequest("CON001", "CUST001", "INST001", Collections.emptyList());
//    when(customerRepository.findById("CUST001")).thenReturn(Optional.of(customer));
//    when(contractRepository.save(any(WaterUsageContract.class))).thenReturn(contract);
//
//    // When
//    var result = contractService.createContract(request);
//
//    // Then
//    assertThat(result).isNotNull();
//    assertThat(result.contractId()).isEqualTo("CON001");
//    verify(contractRepository).save(any(WaterUsageContract.class));
//  }

//  @Test
//  @DisplayName("Should throw exception when creating contract with non-existent customer")
//  void should_ThrowException_When_CreateContractWithInvalidCustomer() {
//    // Given
//    var request = new CreateRequest("CON001", "INVALID", "INST001", Collections.emptyList());
//    when(customerRepository.findById("INVALID")).thenReturn(Optional.empty());
//
//    // When & Then
//    assertThrows(IllegalArgumentException.class, () -> contractService.createContract(request));
//  }

  @Test
  @DisplayName("Should delete contract successfully")
  void should_DeleteContract_When_IdExists() {
    // Given
    when(contractRepository.existsById("CON001")).thenReturn(true);

    // When
    contractService.deleteContract("CON001");

    // Then
    verify(contractRepository).deleteById("CON001");
  }

  @Test
  @DisplayName("Should throw exception when deleting non-existent contract")
  void should_ThrowException_When_DeleteNonExistentContract() {
    // Given
    when(contractRepository.existsById("NON_EXISTENT")).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> contractService.deleteContract("NON_EXISTENT"));
  }

  @Test
  @DisplayName("Should return contract by ID")
  void should_ReturnContract_When_IdExists() {
    // Given
    when(contractRepository.findById("CON001")).thenReturn(Optional.of(contract));

    // When
    var result = contractService.getContractById("CON001");

    // Then
    assertThat(result).isNotNull();
    assertThat(result.contractId()).isEqualTo("CON001");
  }

  @Test
  @DisplayName("Should throw exception when fetching non-existent contract")
  void should_ThrowException_When_GetNonExistentContract() {
    // Given
    when(contractRepository.findById("NON_EXISTENT")).thenReturn(Optional.empty());

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> contractService.getContractById("NON_EXISTENT"));
  }

  @Test
  @DisplayName("Should return all contracts without filter when request is null")
  void should_ReturnAllContracts_When_RequestIsNull() {
    // Given
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, null);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getContent().getFirst().contractId()).isEqualTo("CON001");
    verify(contractRepository).findAll(pageable);
    verify(contractRepository, never()).findAll(any(Specification.class), any(Pageable.class));
  }

  @Test
  @DisplayName("Should return all contracts without filter when request is empty")
  void should_ReturnAllContracts_When_RequestIsEmpty() {
    // Given
    var request = new BaseFilterRequest(null, null, null);
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(pageable);
  }

  @Test
  @DisplayName("Should return all contracts without filter when filter fields are blank/null")
  void should_ReturnAllContracts_When_FilterFieldsAreBlank() {
    // Given
    var request = new BaseFilterRequest("  ", "", "  ");
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(pageable);
  }

  @Test
  @DisplayName("Should return filtered contracts when keyword is provided")
  void should_ReturnFilteredContracts_When_KeywordIsProvided() {
    // Given
    var request = new BaseFilterRequest("search", null, null);
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should return filtered contracts when startDate is provided")
  void should_ReturnFilteredContracts_When_StartDateIsProvided() {
    // Given
    var request = new BaseFilterRequest(null, "01-01-2023", null);
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should return filtered contracts when endDate is provided")
  void should_ReturnFilteredContracts_When_EndDateIsProvided() {
    // Given
    var request = new BaseFilterRequest(null, null, "31-12-2023");
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should return all contracts without filter when all criteria provided")
  void should_ReturnFilteredContracts_When_AllCriteriaProvided() {
    // Given
    var request = new BaseFilterRequest("search", "01-01-2023", "30-12-2023");
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    Page<ContractResponse> result = contractService.getAllContracts(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should throw exception when date format is invalid in 'from'")
  void should_ThrowException_When_FromDateFormatIsInvalid() {
    // Given
    var request = new BaseFilterRequest(null, "2023-01-01", null);

    // When & Then
    assertThrows(java.time.format.DateTimeParseException.class, () -> contractService.getAllContracts(pageable, request));
  }

  @Test
  @DisplayName("Should throw exception when date format is invalid in 'to'")
  void should_ThrowException_When_ToDateFormatIsInvalid() {
    // Given
    var request = new BaseFilterRequest(null, null, "2023/12/31");

    // When & Then
    assertThrows(java.time.format.DateTimeParseException.class, () -> contractService.getAllContracts(pageable, request));
  }

  @Test
  @DisplayName("Should return filtered contracts when only 'from' date is provided")
  void should_ReturnFilteredContracts_When_OnlyFromIsProvided() {
    // Given
    var request = new BaseFilterRequest(null, "01-01-2023", null);
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    contractService.getAllContracts(pageable, request);

    // Then
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  @DisplayName("Should return filtered contracts when only 'to' date is provided")
  void should_ReturnFilteredContracts_When_OnlyToIsProvided() {
    // Given
    var request = new BaseFilterRequest(null, null, "31-12-2023");
    Page<WaterUsageContract> contractPage = new PageImpl<>(List.of(contract));
    when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(contractPage);

    // When
    contractService.getAllContracts(pageable, request);

    // Then
    verify(contractRepository).findAll(any(Specification.class), eq(pageable));
  }
}
