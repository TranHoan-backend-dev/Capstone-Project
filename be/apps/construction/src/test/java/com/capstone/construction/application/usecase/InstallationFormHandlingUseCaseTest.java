package com.capstone.construction.application.usecase;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.*;
import com.capstone.construction.application.dto.response.installationform.*;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstallationFormHandlingUseCaseTest {

  @Mock
  private InstallationFormService ifSrv;

  @Mock
  private MessageProducer messageProducer;

  @Mock
  private EmployeeService empSrv;

  @Mock
  private CostEstimateUseCase costEstimateUseCase;

  @InjectMocks
  private InstallationFormHandlingUseCase useCase;

  private static final String USER_ID = "EMP-001";

  @Test
  void should_ReturnPaginatedForms_When_ServiceReturnsData() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new BaseFilterRequest("keyword", null, null);
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.getInstallationForms(pageable, request)).thenReturn(expectedPage);

    // When
    var actualPage = useCase.getPaginatedInstallationForms(pageable, request);

    // Then
    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getTotalElements()).isEqualTo(1);
    verify(ifSrv).getInstallationForms(pageable, request);
  }

  @Test
  void should_ThrowException_When_FormAlreadyExists() {
    // Given
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessage(Message.PT_53);

    verify(ifSrv).isInstallationFormExisting("FORM-001", "CODE-001");
    verify(ifSrv, never()).createNewInstallationForm(anyString(), any());
  }

  @Test
  void should_CreateFormAndSendEvent_When_FormIsNew() {
    // Given
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(false);

    var formResponse = new NewInstallationFormResponse(
        "FORM-001", "Customer", "CODE-001", USER_ID, LocalDateTime.now());
    when(ifSrv.createNewInstallationForm(USER_ID, request)).thenReturn(formResponse);
    when(empSrv.getEmployeeNameById(USER_ID))
        .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = useCase.createNewInstallationRequest(USER_ID, request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.formNumber()).isEqualTo("FORM-001");
    verify(ifSrv).createNewInstallationForm(USER_ID, request);
    verify(messageProducer).send(any(), any());
  }

  @Test
  @DisplayName("Should throw NPE when request is null")
  void should_ThrowException_When_RequestIsNull() {
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, null))
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_ApproveAndCreateEstimate_When_StatusIsTrue() {
    // Given
    var request = new ApproveRequest( "F-001", "C-001", true);
    var order = mock(InstallationFormListResponse.class);
    when(order.formCode()).thenReturn("C-001");
    when(order.formNumber()).thenReturn("F-001");
    when(order.registrationAt()).thenReturn("2024-01-01");

    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    // When
    useCase.approveInstallationForm(request);

    // Then
    verify(ifSrv).approveAndAssignInstallationForm(request);
    verify(costEstimateUseCase).createEstimate(any());
  }

  @Test
  void should_ApproveAndNotCreateEstimate_When_StatusIsFalse() {
    // Given
    var request = new ApproveRequest("F-001", "C-001", false);
    var order = mock(InstallationFormListResponse.class);
    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    // When
    useCase.approveInstallationForm(request);

    // Then
    verify(ifSrv).approveAndAssignInstallationForm(request);
    verify(costEstimateUseCase, never()).createEstimate(any());
  }

  @Test
  void should_ReturnData_When_GettingPaginatedConstructionRequest() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new BaseFilterRequest(null, null, null);
    var response = mock(Page.class);
    when(ifSrv.getConstructionRequestsList(pageable, request)).thenReturn(response);

    // When
    var result = useCase.getPaginatedConstructionRequest(pageable, request);

    // Then
    assertThat(result).isEqualTo(response);
  }

  private @NonNull NewOrderRequest createValidNewOrderRequest() {
    return new NewOrderRequest(
      "CODE-001", "FORM-001", "Customer", "Address", "123456789012", "2020-01-01", "Loc", "0901234567",
      "TAX01", "BANK01", "LOC", com.capstone.common.enumerate.UsageTarget.INSTITUTIONAL, com.capstone.common.enumerate.CustomerType.FAMILY,
      "2024-01-01", "2024-01-05", 1, 1, new ArrayList<>(), "net1", "meter1");
  }
}
