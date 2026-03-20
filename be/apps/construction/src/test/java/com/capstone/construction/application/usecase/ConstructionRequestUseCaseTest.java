package com.capstone.construction.application.usecase;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.construction.AssignRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConstructionRequestUseCaseTest {

    @Mock ConstructionRequestService constructionRequestService;
    @Mock InstallationFormService ifSrv;
    @Mock MessageProducer messageProducer;
    @Mock EmployeeService empSrv;

    @InjectMocks
    ConstructionRequestUseCase useCase;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(useCase, "QUEUE_NAME", "test_queue");
        ReflectionTestUtils.setField(useCase, "PREFIX", "test_prefix");
        ReflectionTestUtils.setField(useCase, "ASSIGN_ACTION", "assign");
    }

    @Test
    void should_AssignSuccessfully_When_ValidInput() {
        // Arrange
        String empId = "EMP001";
        AssignRequest request = new AssignRequest("LDN", "001", "CUS1", "CON1");
        
        when(empSrv.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse<>("OK", RoleName.CONSTRUCTION_DEPARTMENT_STAFF));
        when(ifSrv.getByFormCodeAndFormNumber(anyString(), anyString())).thenReturn(mock(InstallationFormListResponse.class));

        // Act
        useCase.assignToConstructionCaptain(request, empId);

        // Assert
        verify(constructionRequestService).createPendingRequest(eq(empId), eq("CON1"), eq("LDN"), eq("001"));
        verify(ifSrv).assignInstallationForm(eq(empId), any(), eq(false));
        verify(messageProducer).send(anyString(), any());
    }

    @Test
    void should_ThrowException_When_RoleIsInvalid() {
        // Arrange
        String empId = "EMP001";
        AssignRequest request = new AssignRequest("LDN", "001", "CUS1", "CON1");
        
        when(empSrv.getRoleOfEmployeeById(empId)).thenReturn(new WrapperApiResponse<>("OK", RoleName.ORDER_RECEIVING_STAFF));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> useCase.assignToConstructionCaptain(request, empId));
    }

    @Test
    void should_ReturnPaginatedResults_When_Requested() {
        // Act
        useCase.getPaginatedConstructionRequest(null, null);

        // Assert
        verify(ifSrv).getConstructionRequestsList(any(), any());
    }
}
