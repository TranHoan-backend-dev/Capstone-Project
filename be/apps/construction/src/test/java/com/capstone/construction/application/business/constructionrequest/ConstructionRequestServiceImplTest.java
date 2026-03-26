package com.capstone.construction.application.business.constructionrequest;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.domain.model.ConstructionRequest;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.ConstructionRequestRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.CustomerService;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConstructionRequestServiceImplTest {

  @Mock
  ConstructionRequestRepository repository;
  @Mock
  CustomerService customerService;
  @Mock
  InstallationFormRepository ifRepo;
  @Mock
  EmployeeService employeeService;

  @InjectMocks
  ConstructionRequestServiceImpl service;

  @Test
  void should_CreatePendingRequest_Successfully() {
    // Arrange
    var empId = "EMP1";
    var contractId = "CON1";
    var formCode = "LDN";
    var formNumber = "001";

    when(customerService.checkExistenceOfCustomer(empId)).thenReturn(true);
    when(customerService.checkExistenceOfContract(contractId)).thenReturn(true);
    when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse(200, "OK", RoleName.CONSTRUCTION_DEPARTMENT_STAFF.name(), OffsetDateTime.now()));

    InstallationForm form = new InstallationForm();
    form.setFormCode(formCode);
    form.setFormNumber(formNumber);
    when(ifRepo.findById(new InstallationFormId(formCode, formNumber))).thenReturn(Optional.of(form));

    ConstructionRequest request = ConstructionRequest.builder()
      .id("REQ1")
      .contractId(contractId)
      .installationForm(form)
      .isApproved(false)
      .createdAt(LocalDateTime.now())
      .build();
    when(repository.save(any())).thenReturn(request);

    // Act
    var result = service.createPendingRequest(empId, contractId, formCode, formNumber);

    // Assert
    assertNotNull(result);
    assertEquals("REQ1", result.id());
    verify(repository).save(any());
  }

  @Test
  void should_ThrowException_When_ContractNotFound() {
    when(customerService.checkExistenceOfCustomer(anyString())).thenReturn(true);
    when(customerService.checkExistenceOfContract(anyString())).thenReturn(false);
    assertThrows(IllegalArgumentException.class, () -> service.createPendingRequest("E1", "C1", "F", "N"));
  }

  @Test
  void should_UpdatePendingRequest_Successfully() {
    // Arrange
    var id = "REQ1";
    var empId = "EMP1";
    var request = mock(ConstructionRequest.class);
    var form = new InstallationForm();

    when(repository.findById(id)).thenReturn(Optional.of(request));
    when(request.getInstallationForm()).thenReturn(form);
    when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse(200, "OK", RoleName.CONSTRUCTION_DEPARTMENT_STAFF.name(), OffsetDateTime.now()));

    // Act
    service.updatePendingRequest(id, empId);

    // Assert
    assertEquals(empId, form.getConstructedBy());
    verify(ifRepo).save(form);
  }

  @Test
  void should_ThrowException_When_EmployeeNotExists() {
    var id = "REQ1";
    var empId = "EMP1";
    when(repository.findById(id)).thenReturn(Optional.of(mock(ConstructionRequest.class)));
    when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse(200, "OK", false, OffsetDateTime.now()));

    assertThrows(IllegalArgumentException.class, () -> service.updatePendingRequest(id, empId));
  }

  @Test
  void should_ThrowException_When_RoleIsMismatch() {
    var id = "REQ1";
    var empId = "EMP1";
    when(repository.findById(id)).thenReturn(Optional.of(mock(ConstructionRequest.class)));
    when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse(200, "OK", RoleName.ORDER_RECEIVING_STAFF.name(), OffsetDateTime.now()));

    assertThrows(IllegalArgumentException.class, () -> service.updatePendingRequest(id, empId));
  }
}
