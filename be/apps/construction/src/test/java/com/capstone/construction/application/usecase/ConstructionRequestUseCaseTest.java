package com.capstone.construction.application.usecase;

import com.capstone.common.request.BaseFilterRequest;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.construction.AssignRequest;
import com.capstone.construction.application.dto.response.construction.ConstructionResponse;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.construction.ApprovedEvent;
import com.capstone.construction.application.event.producer.construction.UpdateEvent;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.common.response.WrapperApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConstructionRequestUseCaseTest {

  @Mock
  ConstructionRequestService constructionRequestService;
  @Mock
  InstallationFormService ifSrv;
  @Mock
  MessageProducer messageProducer;
  @Mock
  EmployeeService employeeService;

  @InjectMocks
  ConstructionRequestUseCase useCase;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(useCase, "QUEUE_NAME", "test_queue");
    ReflectionTestUtils.setField(useCase, "CONSTRUCTION_REQUEST_PREFIX", ".prefix.");
    ReflectionTestUtils.setField(useCase, "ASSIGN_ACTION", "assign");
    ReflectionTestUtils.setField(useCase, "UPDATE_ACTION", "update");
    ReflectionTestUtils.setField(useCase, "APPROVED_ACTION", "approve");
  }

  @Test
  void should_AssignSuccessfully_When_ValidInput() {
    // Arrange
    var empId = "EMP001";
    var request = new AssignRequest("1001", "1", "CON1");

    // ConstructionRequestUseCase itself doesn't validate the role.
    // If we want to simulate role validation failure, we need to mock the service behavior.
    when(ifSrv.getByFormCodeAndFormNumber(anyString(), anyString())).thenReturn(mock(InstallationFormListResponse.class));

    // Act
    useCase.createAndAssignToConstructionCaptain(request, empId);

    // Assert
    verify(constructionRequestService).createPendingRequest(eq(empId), eq("CON1"), eq("1001"), eq("1"));
    verify(ifSrv).assignInstallationForm(eq(empId), any(), eq(false));
    verify(messageProducer).send(anyString(), any());
  }

  @Test
  void should_ThrowException_When_ServiceThrows() {
    // Arrange
    var empId = "EMP001";
    var request = new AssignRequest("1001", "1", "CON1");

    // Simulating Service layer throwing an error
    doThrow(new IllegalArgumentException("Role invalid"))
      .when(constructionRequestService).createPendingRequest(anyString(), anyString(), anyString(), anyString());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> useCase.createAndAssignToConstructionCaptain(request, empId));
  }

  @Test
  void should_ReturnPaginatedResults_When_Requested() {
    // Act
    useCase.getPaginatedConstructionRequest(Pageable.unpaged(), new BaseFilterRequest(null, null, null));

    // Assert
    verify(constructionRequestService).getConstructionRequestsList(any(), any());
  }

  @Test
  @DisplayName("Should update construction request and send event")
  void should_UpdateConstructionRequest_Success() {
    var id = "req-123";
    var empId = "EMP-001";
    var formResponse = mock(InstallationFormListResponse.class);
    when(formResponse.formCode()).thenReturn("C1");
    when(formResponse.formNumber()).thenReturn("N1");
    when(formResponse.constructedBy()).thenReturn(empId);

    // Mock private helper installationForm(id)
    var constructionRequest = mock(ConstructionResponse.class);
    var mockIf = mock(InstallationFormListResponse.class);
    when(constructionRequest.installationForm()).thenReturn(mockIf);
    when(mockIf.formCode()).thenReturn("C1");
    when(mockIf.formNumber()).thenReturn("N1");

    when(constructionRequestService.getById(id)).thenReturn(constructionRequest);
    when(ifSrv.getByFormCodeAndFormNumber("C1", "N1")).thenReturn(formResponse);
    when(employeeService.getEmployeeNameById(empId)).thenReturn(new WrapperApiResponse(200, "OK", "Emp Name", null));

    useCase.updateConstructionRequest(id, empId);

    verify(constructionRequestService).updatePendingRequest(id, empId);
    verify(messageProducer).send(eq("test_queue.prefix.update"), any(UpdateEvent.class));
  }

  @Test
  @DisplayName("Should approve construction and send event when approved is true")
  void should_ApproveConstruction_Success_True() {
    var id = "req-123";
    var empId = "EMP-001";
    var formResponse = mock(InstallationFormListResponse.class);
    when(formResponse.formCode()).thenReturn("C1");
    when(formResponse.formNumber()).thenReturn("N1");
    when(formResponse.constructedBy()).thenReturn(empId);

    var constructionRequest = mock(ConstructionResponse.class);
    var mockIf = mock(InstallationFormListResponse.class);
    when(constructionRequest.installationForm()).thenReturn(mockIf);
    when(constructionRequestService.getById(id)).thenReturn(constructionRequest);
    when(ifSrv.getByFormCodeAndFormNumber(any(), any())).thenReturn(formResponse);
    when(employeeService.getEmployeeNameById(empId)).thenReturn(new WrapperApiResponse(200, "OK", "Emp Name", null));

    useCase.approveTheConstruction(id, true);

    verify(constructionRequestService).approveTheConstruction(id, true);
    verify(messageProducer).send(eq("test_queue.prefix.approve"), any(ApprovedEvent.class));
  }

  @Test
  @DisplayName("Should approve construction but NOT send event when approved is false")
  void should_ApproveConstruction_Success_False() {
    var id = "req-123";
    useCase.approveTheConstruction(id, false);

    verify(constructionRequestService).approveTheConstruction(id, false);
    verifyNoInteractions(messageProducer);
  }
}
