package com.capstone.construction.application.usecase;

import com.capstone.common.request.BaseFilterRequest;
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
  EmployeeService empSrv;

  @InjectMocks
  ConstructionRequestUseCase useCase;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(useCase, "QUEUE_NAME", "test_queue");
    ReflectionTestUtils.setField(useCase, "INSTALLATION_FORM_PREFIX", ".prefix.");
    ReflectionTestUtils.setField(useCase, "ASSIGN_ACTION", "assign");
  }

  @Test
  void should_AssignSuccessfully_When_ValidInput() {
    // Arrange
    var empId = "EMP001";
    var request = new AssignRequest(1001L, 1L, "CON1");

    // ConstructionRequestUseCase itself doesn't validate the role.
    // If we want to simulate role validation failure, we need to mock the service behavior.
    when(ifSrv.getByFormCodeAndFormNumber(anyLong(), anyLong())).thenReturn(mock(InstallationFormListResponse.class));

    // Act
    useCase.createAndAssignToConstructionCaptain(request, empId);

    // Assert
    verify(constructionRequestService).createPendingRequest(eq(empId), eq("CON1"), eq(1001L), eq(1L));
    verify(ifSrv).assignInstallationForm(eq(empId), any(), eq(false));
    verify(messageProducer).send(anyString(), any());
  }

  @Test
  void should_ThrowException_When_ServiceThrows() {
    // Arrange
    var empId = "EMP001";
    var request = new AssignRequest(1001L, 1L, "CON1");

    // Simulating Service layer throwing an error
    doThrow(new IllegalArgumentException("Role invalid"))
      .when(constructionRequestService).createPendingRequest(anyString(), anyString(), anyLong(), anyLong());

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
}
