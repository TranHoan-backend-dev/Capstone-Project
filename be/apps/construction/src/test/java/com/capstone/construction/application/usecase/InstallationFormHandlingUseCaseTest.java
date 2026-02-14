package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.InstallationFormCreatedEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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
    @DisplayName("should_ReturnPaginatedForms_When_ServiceReturnsData")
    void should_ReturnPaginatedForms_When_ServiceReturnsData() {
        // Given
        var pageable = Pageable.unpaged();
        var request = new FilterFormRequest("keyword", null, null);
        var responseItem = mock(InstallationFormListResponse.class);
        var expectedPage = new PageImpl<>(List.of(responseItem));

        when(ifSrv.getInstallationForms(pageable, request)).thenReturn(expectedPage);

        // When
        Page<InstallationFormListResponse> actualPage = useCase.getPaginatedInstallationForms(pageable, request);

        // Then
        assertNotNull(actualPage);
        assertEquals(1, actualPage.getTotalElements());
        verify(ifSrv).getInstallationForms(pageable, request);
    }

    @Test
    @DisplayName("should_ThrowException_When_FormAlreadyExists")
    void should_ThrowException_When_FormAlreadyExists() {
        // Given
        var request = mock(NewOrderRequest.class);
        when(request.formNumber()).thenReturn("FORM-001");
        when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(true);

        // When & Then
        var exception = assertThrows(ExistingItemException.class, () -> {
            useCase.createNewInstallationRequest(request);
        });

        assertEquals(Constant.SE_01, exception.getMessage()); // Assuming exception message uses Constant.SE_01 or
                                                              // similar key
        verify(ifSrv).isInstallationFormExisting("FORM-001", "CODE-001");
        verify(ifSrv, never()).createNewInstallationForm(any());
    }

    @Test
    @DisplayName("should_CreateFormAndSendEvent_When_FormIsNew")
    void should_CreateFormAndSendEvent_When_FormIsNew() {
        // Given
        var request = mock(NewOrderRequest.class);
        when(request.formNumber()).thenReturn("FORM-001");
        when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(false);

        var formResponse = new NewInstallationFormResponse(
                "FORM-001", "Customer", "Address", "Phone", java.time.LocalDateTime.of(2023, 1, 1, 0, 0));
        when(ifSrv.createNewInstallationForm(request)).thenReturn(formResponse);

        // When
        var result = useCase.createNewInstallationRequest(request);

        // Then
        assertNotNull(result);
        assertEquals("FORM-001", result.formNumber());
        verify(ifSrv).createNewInstallationForm(request);
        verify(messageProducer).sendInstallationFormCreatedEvent(any(InstallationFormCreatedEvent.class));
    }
}
