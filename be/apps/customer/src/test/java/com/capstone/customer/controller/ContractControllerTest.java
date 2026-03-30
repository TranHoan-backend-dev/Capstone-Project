package com.capstone.customer.controller;

import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.service.boundary.ContractService;
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
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContractControllerTest {

  @Mock
  private ContractService contractService;

  @Mock
  private Logger log;

  @InjectMocks
  private ContractController contractController;

  private CreateRequest createRequest;
  private ContractResponse mockResponse;
  private Pageable pageable;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(contractController, "log", log);

    // CreateRequest has 5 fields: contractId, formCode, formNumber, representatives, appendix
    createRequest = new CreateRequest(
      "HD001", "FORM001", "NUM001", Collections.emptyList(), Collections.emptyList()
    );

    // ContractResponse has 5 fields: contractId, createdAt, updatedAt, installationFormId, representatives
    mockResponse = new ContractResponse(
      "HD001", LocalDateTime.now(), LocalDateTime.now(), "FORM001", Collections.emptyList()
    );

    pageable = PageRequest.of(0, 10);
  }

  @Test
  @DisplayName("Should return created when createContract is successful")
  void should_ReturnCreated_When_CreateContract() {
    // Arrange
    when(contractService.createContract(any(CreateRequest.class))).thenReturn(mockResponse);

    // Act
    var responseEntity = contractController.createContract(createRequest);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Tạo hợp đồng thành công");
    verify(contractService).createContract(createRequest);
    verify(log).info("REST request to create contract: {}", createRequest.contractId());
  }

  @Test
  @DisplayName("Should return OK when deleteContract is successful")
  void should_ReturnOk_When_DeleteContract() {
    // Arrange
    var id = "HD001";
    doNothing().when(contractService).deleteContract(id);

    // Act
    var responseEntity = contractController.deleteContract(id);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Xóa hợp đồng thành công");
    verify(contractService).deleteContract(id);
    verify(log).info("REST request to delete contract: {}", id);
  }

  @Test
  @DisplayName("Should return OK when getContractById is successful")
  void should_ReturnOk_When_GetContractById() {
    // Arrange
    var id = "HD001";
    when(contractService.getContractById(id)).thenReturn(mockResponse);

    // Act
    var responseEntity = contractController.getContractById(id);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Lấy thông tin hợp đồng thành công");
    assertThat(responseEntity.getBody().data()).isEqualTo(mockResponse);
    verify(contractService).getContractById(id);
    verify(log).info("REST request to get contract: {}", id);
  }

  @Test
  @DisplayName("Should return OK when getAllContracts is successful")
  void should_ReturnOk_When_GetAllContracts() {
    // Arrange
    // Use ContractFilterRequest instead of BaseFilterRequest
    var filter = new ContractFilterRequest("HD", null, null, null, null, null, null, null, null, null, null);
    Page<ContractResponse> mockPage = new PageImpl<>(List.of(mockResponse));
    when(contractService.getAllContracts(any(Pageable.class), any(ContractFilterRequest.class))).thenReturn(mockPage);

    // Act
    var responseEntity = contractController.getAllContracts(pageable, filter);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Lấy danh sách hợp đồng thành công");
    assertThat(responseEntity.getBody().data()).isEqualTo(mockPage);
    verify(contractService).getAllContracts(pageable, filter);
    verify(log).info("REST request to get all contracts with pagination: {}", pageable);
  }

  @Test
  @DisplayName("Should return OK when getContractIdsByForms is successful")
  void should_ReturnOk_When_GetContractIdsByForms() {
    // Arrange
    var formCode = "FORM001";
    var formNumber = "NUM001";
    var mockIds = List.of("HD001", "HD002");
    when(contractService.findContractIdsByFormCodeAndFormNumber(formCode, formNumber)).thenReturn(mockIds);

    // Act
    var responseEntity = contractController.getContractIdsByForms(formCode, formNumber);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Lấy danh sách ID hợp đồng thành công");
    assertThat(responseEntity.getBody().data()).isEqualTo(mockIds);
    verify(contractService).findContractIdsByFormCodeAndFormNumber(formCode, formNumber);
    verify(log).info("REST request to get contract IDs by formCode: {} and formNumber: {}", formCode, formNumber);
  }
}
