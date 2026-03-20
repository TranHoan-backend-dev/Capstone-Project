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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConstructionRequestServiceImplTest {

    @Mock ConstructionRequestRepository repository;
    @Mock CustomerService customerService;
    @Mock InstallationFormRepository ifRepo;
    @Mock EmployeeService employeeService;

    @InjectMocks
    ConstructionRequestServiceImpl service;

    @Test
    void should_CreatePendingRequest_Successfully() {
        // Arrange
        String empId = "EMP1";
        String contractId = "CON1";
        String formCode = "LDN";
        String formNumber = "001";
        
        when(customerService.checkExistenceOfContract(contractId)).thenReturn(true);
        when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse<>("OK", true));
        when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse<>("OK", RoleName.CONSTRUCTION_DEPARTMENT_STAFF.name()));
        when(ifRepo.findById(new InstallationFormId(formCode, formNumber))).thenReturn(Optional.of(new InstallationForm()));
        when(repository.save(any())).thenReturn(new ConstructionRequest());

        // Act
        ConstructionRequest result = service.createPendingRequest(empId, contractId, formCode, formNumber);

        // Assert
        assertNotNull(result);
        verify(repository).save(any());
    }

    @Test
    void should_ThrowException_When_ContractNotFound() {
        when(customerService.checkExistenceOfContract(anyString())).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> service.createPendingRequest("E1", "C1", "F", "N"));
    }

    @Test
    void should_UpdatePendingRequest_Successfully() {
        // Arrange
        String id = "REQ1";
        String empId = "EMP1";
        ConstructionRequest request = mock(ConstructionRequest.class);
        InstallationForm form = new InstallationForm();
        
        when(repository.findById(id)).thenReturn(Optional.of(request));
        when(request.getInstallationForm()).thenReturn(form);
        when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse<>("OK", true));
        when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse<>("OK", RoleName.CONSTRUCTION_DEPARTMENT_STAFF.name()));

        // Act
        service.updatePendingRequest(id, empId);

        // Assert
        assertEquals(empId, form.getConstructedBy());
        verify(ifRepo).save(form);
    }

    @Test
    void should_ThrowException_When_EmployeeNotExists() {
        String id = "REQ1";
        String empId = "EMP1";
        when(repository.findById(id)).thenReturn(Optional.of(mock(ConstructionRequest.class)));
        when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse<>("OK", false));
        
        assertThrows(IllegalArgumentException.class, () -> service.updatePendingRequest(id, empId));
    }

    @Test
    void should_ThrowException_When_RoleIsMismatch() {
        String id = "REQ1";
        String empId = "EMP1";
        when(repository.findById(id)).thenReturn(Optional.of(mock(ConstructionRequest.class)));
        when(employeeService.isEmployeeExisting(empId)).thenReturn(new WrapperApiResponse<>("OK", true));
        when(employeeService.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse<>("OK", RoleName.ORDER_RECEIVING_STAFF.name()));
        
        assertThrows(IllegalArgumentException.class, () -> service.updatePendingRequest(id, empId));
    }
}
