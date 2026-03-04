package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
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
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(false);

    var formResponse = new NewInstallationFormResponse(
        "FORM-001", "Customer", "Address", "Phone", LocalDateTime.of(2023, 1, 1, 0, 0));
    when(ifSrv.createNewInstallationForm(request)).thenReturn(formResponse);

    // When
    var result = useCase.createNewInstallationRequest(request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.formNumber()).isEqualTo("FORM-001");
    verify(ifSrv).createNewInstallationForm(request);
  }

  @Test
  @org.junit.jupiter.api.DisplayName("Should throw NPE when request is null")
  void should_ThrowException_When_RequestIsNull() {
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(null))
        .isInstanceOf(NullPointerException.class);
  }
}
