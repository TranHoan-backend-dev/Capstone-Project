package com.capstone.construction.application.usecase;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.FilterConstructionOrderRequest;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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

  @InjectMocks
  private InstallationFormHandlingUseCase useCase;

  @Test
  void should_ReturnPaginatedForms_When_ServiceReturnsData() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest("keyword", null, null);
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
    var request = mock(NewOrderRequest.class);
    when(request.formNumber()).thenReturn("FORM-001");
    when(request.formCode()).thenReturn("CODE-001");
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessage(Constant.SE_01);

    verify(ifSrv).isInstallationFormExisting("FORM-001", "CODE-001");
    verify(ifSrv, never()).createNewInstallationForm(any());
  }

  @Test
  void should_CreateFormAndSendEvent_When_FormIsNew() {
    // Given
    var request = mock(NewOrderRequest.class);
    when(request.formNumber()).thenReturn("FORM-001");
    when(request.formCode()).thenReturn("CODE-001");
    when(request.numberOfHousehold()).thenReturn(1);
    when(request.householdRegistrationNumber()).thenReturn(123);
    when(request.createdBy()).thenReturn("EMP01");
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(false);

    var formResponse = new NewInstallationFormResponse(
        "FORM-001", "Customer", "CODE-001", "EMP01", LocalDateTime.now());
    when(ifSrv.createNewInstallationForm(request)).thenReturn(formResponse);
    when(empSrv.getEmployeeNameById("EMP01"))
        .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = useCase.createNewInstallationRequest(request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.formNumber()).isEqualTo("FORM-001");
    verify(ifSrv).createNewInstallationForm(request);
    verify(messageProducer).send(any(), any());
  }

  @Test
  @org.junit.jupiter.api.DisplayName("Should throw NPE when request is null")
  void should_ThrowException_When_RequestIsNull() {
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(null))
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_ApproveAndSendEvent_When_StatusIsTrue() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", true);
    var order = mock(InstallationFormListResponse.class);
    when(order.formCode()).thenReturn("C-001");
    when(order.formNumber()).thenReturn("F-001");

    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    // When
    useCase.approveInstallationForm(request);

    // Then
    verify(ifSrv).approveAndAssignInstallationForm(request);
    verify(messageProducer).send(any(), any());
  }

  @Test
  void should_ApproveAndNotSendEvent_When_StatusIsFalse() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", false);
    var order = mock(InstallationFormListResponse.class);
    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    // When
    useCase.approveInstallationForm(request);

    // Then
    verify(ifSrv).approveAndAssignInstallationForm(request);
    verify(messageProducer, never()).send(any(), any());
  }

  @Test
  void should_ReturnNull_When_GettingPaginatedConstructionRequest() {
    // When
    var result = useCase.getPaginatedConstructionRequest(Pageable.unpaged(),
        mock(FilterConstructionOrderRequest.class));

    // Then
    assertThat(result).isNull();
  }
}
