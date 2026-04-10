package com.capstone.customer.service.impl;

import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.model.WaterUsageContract;
import com.capstone.customer.repository.ContractRepository;
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
import java.time.format.DateTimeParseException;
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

  @InjectMocks
  private ContractServiceImpl contractService;

  private Pageable pageable;
  private WaterUsageContract contract;

  @BeforeEach
  void setUp() {
    pageable = PageRequest.of(0, 10);
    var customer = mock(Customer.class);
    lenient().when(customer.getName()).thenReturn("Test Customer");
    lenient().when(customer.getCustomerId()).thenReturn("CUST001");

    var now = LocalDateTime.now();
    contract = mock(WaterUsageContract.class);
    lenient().when(contract.getContractId()).thenReturn("CON001");
    lenient().when(contract.getFormCode()).thenReturn("INST001");
    lenient().when(contract.getFormNumber()).thenReturn("NUM001");
    lenient().when(contract.getCreatedAt()).thenReturn(now);
    lenient().when(contract.getUpdatedAt()).thenReturn(now);
    lenient().when(contract.getRepresentative()).thenReturn(Collections.emptyList());
    lenient().when(contract.getAppendix()).thenReturn(Collections.emptyList());
  }

  @Test
  @DisplayName("Should create contract successfully")
  void should_CreateContract_When_InputIsValid() {
    // Given
    // CreateRequest: contractId, formCode, formNumber, representatives, appendix
    var request = new CreateRequest("CON001", "INST001", "NUM001", Collections.emptyList(), Collections.emptyList());
    when(contractRepository.save(any(WaterUsageContract.class))).thenReturn(contract);

    // When
    var result = contractService.createContract(request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.contractId()).isEqualTo("CON001");
    verify(contractRepository).save(any(WaterUsageContract.class));
  }

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
    var request = new ContractFilterRequest(null, null, null, null, null, null, null, null, null, null, null);
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
    var request = new ContractFilterRequest("  ", "", "  ", null, null, null, null, null, null, null, null);
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
    var request = new ContractFilterRequest("search", null, null, null, null, null, null, null, null, null, null);
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
    // from is 8th parameter
    var request = new ContractFilterRequest(null, null, null, null, null, null, null, "01-01-2023 00:00:00", null, null, null);
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
    // to is 9th parameter
    var request = new ContractFilterRequest(null, null, null, null, null, null, null, null, "31-12-2023 23:59:59", null, null);
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
    var request = new ContractFilterRequest("search", null, null, null, null, null, null, "01-01-2023 00:00:00", "30-12-2023 23:59:59", null, null);
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
    var request = new ContractFilterRequest(null, null, null, null, null, null, null, "2023-01-01", null, null, null);

    // When & Then
    assertThrows(DateTimeParseException.class, () -> contractService.getAllContracts(pageable, request));
  }

  @Test
  @DisplayName("Should throw exception when date format is invalid in 'to'")
  void should_ThrowException_When_ToDateFormatIsInvalid() {
    // Given
    var request = new ContractFilterRequest(null, null, null, null, null, null, null, null, "2023/12/31", null, null);

    // When & Then
    assertThrows(java.time.format.DateTimeParseException.class,
      () -> contractService.getAllContracts(pageable, request));
  }

  @Test
  @DisplayName("Should return contract IDs by form code and number")
  void should_ReturnContractIds_When_FormCodeAndNumberProvided() {
    // Given
    var formCode = "INST001";
    var formNumber = "NUM001";
    List<String> expectedIds = List.of("CON001", "CON002");
    when(contractRepository.findContractIdsByFormCodeAndFormNumber(formCode, formNumber)).thenReturn(expectedIds);

    // When
    var result = contractService.findContractIdsByFormCodeAndFormNumber(formCode, formNumber);

    // Then
    assertThat(result).isNotNull();
    assertThat(result).hasSize(2);
    assertThat(result).containsExactly("CON001", "CON002");
    verify(contractRepository).findContractIdsByFormCodeAndFormNumber(formCode, formNumber);
  }

  @Test
  @DisplayName("Should return empty list when no contract matches form code and number")
  void should_ReturnEmptyList_When_NoContractMatchesForm() {
    // Given
    var formCode = "NON_EXISTENT";
    var formNumber = "000";
    when(contractRepository.findContractIdsByFormCodeAndFormNumber(formCode, formNumber))
      .thenReturn(Collections.emptyList());

    // When
    var result = contractService.findContractIdsByFormCodeAndFormNumber(formCode, formNumber);

    // Then
    assertThat(result).isNotNull();
    assertThat(result).isEmpty();
    verify(contractRepository).findContractIdsByFormCodeAndFormNumber(formCode, formNumber);
  }

  @Test
  @DisplayName("Should return true when contract exists by id")
  void should_ReturnTrue_When_ContractExistsById() {
    // Given
    var id = "CON001";
    when(contractRepository.existsById(id)).thenReturn(true);

    // When
    var result = contractService.isExist(id);

    // Then
    assertThat(result).isTrue();
    verify(contractRepository).existsById(id);
  }

  @Test
  @DisplayName("Should return latest contract ID when prefix matches")
  void should_ReturnLatestContractId_When_PrefixMatches() {
    // Given
    var prefix = "HQU";
    var expectedId = "HQU0005";
    when(contractRepository.findMaxContractIdByPrefix(prefix)).thenReturn(expectedId);

    // When
    var result = contractService.getLatestContractIdByPrefix(prefix);

    // Then
    assertThat(result).isEqualTo(expectedId);
    verify(contractRepository).findMaxContractIdByPrefix(prefix);
  }

  @Test
  @DisplayName("Should return null when no contract matches prefix")
  void should_ReturnNull_When_NoContractMatchesPrefix() {
    // Given
    var prefix = "NON";
    when(contractRepository.findMaxContractIdByPrefix(prefix)).thenReturn(null);

    // When
    var result = contractService.getLatestContractIdByPrefix(prefix);

    // Then
    assertThat(result).isNull();
    verify(contractRepository).findMaxContractIdByPrefix(prefix);
  }

  @Test
  @DisplayName("Should return null when maxId is blank")
  void should_ReturnNull_When_MaxIdIsBlank() {
    // Given
    var prefix = "HQU";
    when(contractRepository.findMaxContractIdByPrefix(prefix)).thenReturn(" ");

    // When
    var result = contractService.getLatestContractIdByPrefix(prefix);

    // Then
    assertThat(result).isNull();
    verify(contractRepository).findMaxContractIdByPrefix(prefix);
  }
}
